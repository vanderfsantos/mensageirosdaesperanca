import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Rotas administrativas públicas — não exigem autenticação prévia
const PUBLIC_ADMIN_ROUTES = [
  '/admin/login',
  '/admin/cadastro',
  '/admin/esqueci-senha',
  '/admin/redefinir-senha',
  '/admin/aguardando-aprovacao',
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Se não for rota /admin, libera imediatamente
  if (!isAdminRoute) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Verifica se há qualquer cookie de sessão ativo (Supabase sb- ou mock-session)
  const allCookies = request.cookies.getAll();
  const hasSupabaseCookie = allCookies.some((c) => c.name.startsWith('sb-') && c.value.length > 0);
  const mockSession = request.cookies.get('mock-session')?.value;
  const hasAnyAuthCookie = hasSupabaseCookie || !!mockSession;

  // 1. Se NÃO há cookies de sessão
  if (!hasAnyAuthCookie) {
    if (!isPublicAdminRoute) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // 2. Modo Simulação (Mock Auth)
  if (!supabaseUrl || !supabaseAnonKey) {
    if (!mockSession && !isPublicAdminRoute) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    if (mockSession && pathname === '/admin/login') {
      const redirectUrl = new URL('/admin', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // 3. Supabase SSR — Validação de Usuário e Verificação Obrigatória de Status
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Rota protegida sem usuário autenticado → login
    if (!user && !isPublicAdminRoute) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (user) {
      // Checagem obrigatória do status do usuário na tabela public.profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .maybeSingle();

      const userStatus = profile?.status?.toLowerCase() || 'pending';

      // Se o status for diferente de 'active', desconecta e redireciona
      if (userStatus !== 'active' && userStatus !== 'ativo') {
        if (!isPublicAdminRoute) {
          await supabase.auth.signOut();
          const redirectUrl = new URL('/admin/login', request.url);
          const errorParam = userStatus === 'blocked' ? 'bloqueado' : 'pendente_aprovacao';
          redirectUrl.searchParams.set('error', errorParam);
          return NextResponse.redirect(redirectUrl);
        }
      } else {
        // Usuário ATIVO tentando acessar a tela de login → redireciona para dashboard
        if (pathname === '/admin/login') {
          const redirectUrl = new URL('/admin', request.url);
          return NextResponse.redirect(redirectUrl);
        }
      }
    }
  } catch (err) {
    console.warn('Middleware: Validação Supabase falhou:', err);
    if (!isPublicAdminRoute) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};

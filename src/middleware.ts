import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Rotas administrativas públicas — não exigem autenticação prévia
const PUBLIC_ADMIN_ROUTES = [
  '/admin/login',
  '/admin/cadastro',
  '/admin/esqueci-senha',
  '/admin/redefinir-senha',
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

  // 1. Otimização Instantânea: Se NÃO há cookies de sessão
  if (!hasAnyAuthCookie) {
    // Se está em rota protegida do admin, redireciona para login sem fazer requisições lentas
    if (!isPublicAdminRoute) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    // Se está em rota pública do admin (login, cadastro), permite direto
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

  // 3. Supabase SSR — Validação com Proteção contra Timeout (Timeout Safe)
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
    // Timeout de 2.5s para evitar que a Vercel Edge mate com 504 GATEWAY_TIMEOUT
    const getUserPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: { user: null }, error: new Error('Timeout') }), 2500)
    );

    const { data: { user } } = await Promise.race([getUserPromise, timeoutPromise]);

    // Rota protegida sem usuário autenticado → login
    if (!user && !isPublicAdminRoute) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Usuário autenticado tentando acessar o login → dashboard
    if (user && pathname === '/admin/login') {
      const redirectUrl = new URL('/admin', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    console.warn('Middleware: Validação Supabase falhou ou timeout:', err);
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

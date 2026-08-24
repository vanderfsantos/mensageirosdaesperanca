import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Rotas administrativas públicas — não exigem autenticação
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // ── Modo de Simulação (Mock Auth) — Supabase não configurado ──────────────
  if (!supabaseUrl || !supabaseAnonKey) {
    const mockSession = request.cookies.get('mock-session')?.value;

    // Rota protegida sem sessão mock → redireciona para login
    if (isAdminRoute && !isPublicAdminRoute && !mockSession) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Usuário com sessão mock tenta acessar login → redireciona para dashboard
    if (pathname === '/admin/login' && mockSession) {
      const redirectUrl = new URL('/admin', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  // ── Supabase SSR — Validação de Sessão Real ───────────────────────────────
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
    if (!user && isAdminRoute && !isPublicAdminRoute) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Usuário autenticado tenta acessar login → dashboard
    if (user && pathname === '/admin/login') {
      const redirectUrl = new URL('/admin', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    console.error('Middleware: Erro ao validar sessão no Supabase SSR', err);
    if (isAdminRoute && !isPublicAdminRoute) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

// Intercepta todas as rotas administrativas
export const config = {
  matcher: ['/admin/:path*'],
};

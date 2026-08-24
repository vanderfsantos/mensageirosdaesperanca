import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const isLoginRoute = request.nextUrl.pathname === '/admin/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Modo de Simulação (Mock Auth) na ausência das chaves de ambiente do Supabase
  if (!supabaseUrl || !supabaseAnonKey) {
    const mockSession = request.cookies.get('mock-session')?.value;

    if (isAdminRoute && !isLoginRoute && !mockSession) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (isLoginRoute && mockSession) {
      const redirectUrl = new URL('/admin', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  // Inicialização do Supabase SSR no Middleware
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    // IMPORTANTE: Obter a sessão usando getUser() que é seguro e refresca o token via cookies
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && !isLoginRoute) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (user && isLoginRoute) {
      const redirectUrl = new URL('/admin', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    console.error('Middleware: Erro ao validar sessão no Supabase SSR', err);
    // Em caso de erro técnico na autenticação, envia para a página de login
    if (!isLoginRoute) {
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

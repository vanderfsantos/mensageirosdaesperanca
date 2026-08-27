import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/admin/aguardando-aprovacao';

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. Validação via token_hash (Padrão de Templates de E-mail do Supabase)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Se for confirmação de cadastro (signup), força o logout para não manter sessão aberta
      if (type === 'signup' || next.includes('aguardando-aprovacao')) {
        await supabase.auth.signOut();
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.warn('Auth Callback: Erro ao verificar token_hash:', error.message);
  }

  // 2. Validação via code (Fluxo PKCE padrão)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Se for confirmação de cadastro, força o logout para não manter sessão aberta
      if (next.includes('aguardando-aprovacao')) {
        await supabase.auth.signOut();
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.warn('Auth Callback: Erro ao trocar code por sessão:', error.message);
  }

  // Em caso de falha/expiração
  return NextResponse.redirect(`${origin}/admin/login?error=link_invalido`);
}

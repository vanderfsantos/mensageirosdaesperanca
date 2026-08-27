'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Users, 
  Layers, 
  Mail, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Heart,
  UserCheck,
  KeyRound
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/ui/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('admin@mensageiros.org');

  const isAuthPage = [
    '/admin/login',
    '/admin/cadastro',
    '/admin/esqueci-senha',
    '/admin/redefinir-senha',
    '/admin/aguardando-aprovacao',
  ].includes(pathname);

  // Fecha o drawer mobile ao mudar de rota
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Carrega a sessão do usuário administrador e valida status
  useEffect(() => {
    if (isAuthPage) return;

    const loadSession = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

      if (!supabaseUrl || !supabaseAnonKey) {
        // Modo de Simulação
        setAdminEmail('admin@mensageiros.org');
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminEmail(user.email || 'admin@mensageiros.org');

        // Checagem de status na tabela public.profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', user.id)
          .maybeSingle();

        const userStatus = profile?.status?.toLowerCase() || 'pending';
        if (userStatus !== 'active' && userStatus !== 'ativo') {
          await supabase.auth.signOut();
          router.push(`/admin/login?error=${userStatus === 'blocked' ? 'bloqueado' : 'pendente_aprovacao'}`);
        }
      }
    };

    loadSession();
  }, [pathname, isAuthPage, router]);

  const handleLogout = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      document.cookie = 'mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      router.push('/admin/login');
      router.refresh();
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  // Se for página de autenticação, não exibe sidebar nem topbar
  if (isAuthPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { label: 'Visão Geral', path: '/admin', icon: LayoutDashboard },
    { label: 'Cursos e Agenda', path: '/admin/agenda', icon: Calendar },
    { label: 'Notícias', path: '/admin/noticias', icon: FileText },
    { label: 'Histórias de Impacto', path: '/admin/historias', icon: Heart },
    { label: 'Transparência', path: '/admin/transparencia', icon: Layers },
    { label: 'Equipe e Governança', path: '/admin/equipe', icon: Users },
    { label: 'Mensagens de Contato', path: '/admin/mensagens', icon: Mail },
    { label: 'Usuários e Acessos', path: '/admin/usuarios', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
      
      {/* =========================================================================
          1. DRAWER MOBILE (Off-canvas Dialog) - Visível apenas no Mobile (<lg)
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Escuro com Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Painel Deslizante da Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 text-slate-300 shadow-2xl z-10 animate-slide-in">
            {/* Header Mobile do Drawer */}
            <div className="flex h-20 items-center justify-between px-5 bg-brand-teal-dark border-b border-brand-teal/40 shrink-0">
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 overflow-hidden py-1">
                <Logo variant="default" className="brightness-150 h-10 w-40" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-brand-teal-light hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Links do Menu Mobile */}
            <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                      isActive
                        ? 'bg-brand-teal-light text-brand-teal-dark font-black shadow-md'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 shrink-0 ${isActive ? 'text-brand-teal-dark' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Rodapé Logout Mobile */}
            <div className="p-4 border-t border-slate-800 shrink-0">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                type="button"
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-wide text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Sair do Painel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. SIDEBAR FIXA DESKTOP (lg:) - Permanece idêntica em telas grandes
          ========================================================================= */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-slate-900 text-slate-300 justify-between border-r border-slate-800 z-30 shrink-0">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header da Sidebar em Teal Escuro */}
          <div className="flex h-20 items-center justify-between px-5 bg-brand-teal-dark border-b border-brand-teal/40 shrink-0">
            <Link href="/admin" className="flex items-center gap-2 overflow-hidden py-1">
              <Logo variant="default" className="brightness-150 h-12 w-48" />
            </Link>
          </div>

          {/* Itens do Menu Desktop */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                    isActive
                      ? 'bg-brand-teal-light text-brand-teal-dark font-black shadow-md shadow-black/10'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                  title={item.label}
                >
                  <IconComponent className={`h-5 w-5 shrink-0 ${isActive ? 'text-brand-teal-dark' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-wide text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer"
            title="Sair / Logout"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          3. CONTAINER PRINCIPAL E TOPBAR
          ========================================================================= */}
      <div className="w-full lg:pl-64 flex flex-col min-h-screen bg-slate-50">
        
        {/* Topbar Superior */}
        <header className="sticky top-0 z-20 h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Botão Hambúrguer Mobile (Apenas em telas menores que lg) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
              <span className="hidden sm:inline">Painel de Controle</span>
              <span className="sm:hidden">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Atalho Site Público */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
            >
              <span className="hidden sm:inline">Ver Site Público</span>
              <span className="sm:hidden">Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            {/* Divisor */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Alterar Senha */}
            <Link
              href="/admin/redefinir-senha"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors bg-slate-50 hover:bg-primary/5 px-3 py-1.5 rounded-lg border border-slate-200"
              title="Redefinir senha da conta"
            >
              <KeyRound className="h-3.5 w-3.5 text-slate-400" />
              Alterar Minha Senha
            </Link>

            {/* Perfil Admin */}
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-700 truncate max-w-40">
                  {adminEmail}
                </span>
                <Link
                  href="/admin/redefinir-senha"
                  className="text-[10px] text-primary hover:underline font-semibold md:hidden"
                >
                  Alterar senha
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport de Conteúdo das Páginas Administrativas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

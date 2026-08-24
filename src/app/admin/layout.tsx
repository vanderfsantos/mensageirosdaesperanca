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
  ChevronLeft,
  Sparkles,
  Heart,
  UserCheck,
  KeyRound
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [adminEmail, setAdminEmail] = useState<string>('admin@mensageiros.org');

  const isAuthPage = [
    '/admin/login',
    '/admin/cadastro',
    '/admin/esqueci-senha',
    '/admin/redefinir-senha',
  ].includes(pathname);

  // Carrega a sessão do usuário administrador (Supabase ou Cookie Mock)
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
      }
    };

    loadSession();
  }, [pathname, isAuthPage]);

  const handleLogout = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      // Limpa cookie de simulação
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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-600">
      {/* Sidebar Administrativa */}
      <aside 
        className={`bg-slate-900 text-slate-300 flex flex-col justify-between transition-all duration-300 border-r border-slate-800 z-30 shrink-0 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col">
          {/* Header da Sidebar */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800 shrink-0">
            {isSidebarOpen ? (
              <Link href="/admin" className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                  M
                </span>
                <span className="font-extrabold text-sm tracking-wider text-white uppercase">
                  Mensageiros
                </span>
              </Link>
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white mx-auto">
                M
              </span>
            )}

            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                type="button"
                className="text-slate-500 hover:text-white transition-colors cursor-pointer hidden md:block"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Itens do Menu */}
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
                      ? 'bg-primary text-white shadow-md shadow-primary/10'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                  title={item.label}
                >
                  <IconComponent className="h-5 w-5 shrink-0" />
                  {isSidebarOpen && <span>{item.label}</span>}
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
            {isSidebarOpen && <span>Sair do Painel</span>}
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar Superior */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Toggler para Mobile / Reabrir sidebar */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              type="button"
              className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" /> Painel de Controle
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Atalho Site Público */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
            >
              Ver Site Público
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
              <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
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

        {/* Viewport de Conteúdo das Sub-rotas */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}


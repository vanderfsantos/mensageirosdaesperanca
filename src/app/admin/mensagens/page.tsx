import { getContactMessages } from '@/lib/supabaseClient';
import MensagensAdmin from '@/components/admin/MensagensAdmin';
import { Inbox } from 'lucide-react';

export const metadata = { title: 'Caixa de Entrada | Admin — Mensageiros da Esperança' };

export const dynamic = 'force-dynamic';

export default async function AdminMensagensPage() {
  const messages = await getContactMessages();

  const pendingCount = messages.filter((m) => m.status === 'pendente').length;
  const anonymousCount = messages.filter((m) => m.isAnonymous).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10">
            <Inbox className="h-5 w-5 text-secondary" />
          </div>
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-black text-white">
              {pendingCount}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Caixa de Entrada</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {messages.length} {messages.length === 1 ? 'mensagem recebida' : 'mensagens recebidas'} •{' '}
            {pendingCount > 0
              ? <span className="text-amber-600 font-semibold">{pendingCount} pendentes</span>
              : <span className="text-emerald-600 font-semibold">todas respondidas</span>}
            {anonymousCount > 0 && <> • {anonymousCount} canal de escuta</>}
          </p>
        </div>
      </div>
      <MensagensAdmin initialMessages={messages} />
    </div>
  );
}

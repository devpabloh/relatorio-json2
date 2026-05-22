'use client'

import { useState } from 'react'
import { BookOpen, ChevronDown, Server, Monitor, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Componente educacional que explica SSR vs CSR
 * Demonstra: useState (CSR) + visualização do fluxo de dados
 */
export function SSRExplainer() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCard, setActiveCard] = useState<'ssr' | 'csr' | null>(null)

  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-semibold text-indigo-700">
            📚 Gere os seus relatórios de forma rápida.
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-indigo-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="animate-fade-in border-t border-indigo-100 p-5">
          {/* Diagrama de fluxo */}
          <div className="mb-5 flex items-center justify-center gap-2 overflow-x-auto py-2">
            <FlowStep icon={<Monitor className="h-4 w-4" />} label="Browser" color="slate" />
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
            <FlowStep icon={<Server className="h-4 w-4" />} label="Next.js\nServidor" color="brand" />
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
            <FlowStep label="HTML\nHidratado" color="emerald" />
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
            <FlowStep label="React\nAtivo" color="amber" />
          </div>

          {/* Cards SSR e CSR */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ExplainerCard
              type="ssr"
              active={activeCard === 'ssr'}
              onToggle={() => setActiveCard(activeCard === 'ssr' ? null : 'ssr')}
              title="🖥️ Server Components (SSR)"
              subtitle="Renderizado no servidor"
              description="Componentes como layout.tsx e page.tsx rodam no servidor. O HTML chega pronto para o browser. Nenhum JS é enviado para estes componentes."
              examples={[
                'app/layout.tsx — estrutura global',
                'app/page.tsx — lê process.env, monta header',
                'api/generate-pdf/route.ts — gera o PDF',
              ]}
              pros={['SEO perfeito', 'Menor bundle', 'Acessa .env do servidor', 'Mais rápido no primeiro load']}
              cons={['Sem useState / useEffect', 'Sem eventos (onClick)', 'Sem window / document']}
              color="blue"
            />

            <ExplainerCard
              type="csr"
              active={activeCard === 'csr'}
              onToggle={() => setActiveCard(activeCard === 'csr' ? null : 'csr')}
              title="💻 Client Components (CSR)"
              subtitle="Renderizado no browser"
              description='Componentes com "use client" no topo. Recebem o HTML do servidor e são "hidratados" — o React assume o controle para interatividade.'
              examples={[
                'ReportGeneratorClient.tsx — abas',
                'JsonInputTab.tsx — upload e textarea',
                'FormInputTab.tsx — formulário dinâmico',
                'PDFDownloadButton.tsx — fetch para API',
              ]}
              pros={['useState, useEffect', 'Eventos (onClick)', 'APIs do browser', 'useFieldArray (forms dinâmicos)']}
              cons={['Maior bundle JS', 'Pior SEO se mal usado', 'Sem acesso direto ao servidor']}
              color="purple"
            />
          </div>

          {/* Dica chave */}
          <div className="mt-4 rounded-lg bg-white p-3 text-xs text-slate-600 shadow-sm">
            <strong className="text-slate-800">💡 Regra de ouro:</strong> Comece tudo como Server Component.
            Só adicione <code className="rounded bg-slate-100 px-1">&quot;use client&quot;</code> quando precisar de estado, eventos ou APIs do browser.
            Isso garante o menor bundle possível enviado ao cliente.
          </div>
        </div>
      )}
    </div>
  )
}

function FlowStep({ icon, label, color }: { icon?: React.ReactNode; label: string; color: string }) {
  const colors: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600',
    brand: 'bg-brand-100 text-brand-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
  }
  return (
    <div className={cn('flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-center', colors[color])}>
      {icon}
      <span className="whitespace-pre text-center text-[10px] font-medium leading-tight">{label}</span>
    </div>
  )
}

function ExplainerCard({
  type,
  active,
  onToggle,
  title,
  subtitle,
  description,
  examples,
  pros,
  cons,
  color,
}: {
  type: 'ssr' | 'csr'
  active: boolean
  onToggle: () => void
  title: string
  subtitle: string
  description: string
  examples: string[]
  pros: string[]
  cons: string[]
  color: 'blue' | 'purple'
}) {
  const colors = {
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
  }
  const titleColors = {
    blue: 'text-blue-800',
    purple: 'text-purple-800',
  }

  return (
    <div
      className={cn('cursor-pointer rounded-xl border p-4 transition-all', colors[color])}
      onClick={onToggle}
    >
      <p className={cn('text-sm font-bold', titleColors[color])}>{title}</p>
      <p className="mb-2 text-xs text-slate-500">{subtitle}</p>
      <p className="text-xs text-slate-600">{description}</p>

      {active && (
        <div className="mt-3 space-y-2 animate-fade-in">
          <div>
            <p className="text-xs font-semibold text-slate-500">Nesta app:</p>
            <ul className="mt-1 space-y-0.5">
              {examples.map((e) => (
                <li key={e} className="text-[11px] text-slate-600">• {e}</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-semibold text-emerald-600">✅ Prós</p>
              {pros.map((p) => <p key={p} className="text-[11px] text-slate-600">• {p}</p>)}
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500">❌ Contras</p>
              {cons.map((c) => <p key={c} className="text-[11px] text-slate-600">• {c}</p>)}
            </div>
          </div>
        </div>
      )}

      <p className="mt-2 text-[10px] text-slate-400">{active ? 'Clique para recolher' : 'Clique para expandir'}</p>
    </div>
  )
}

'use client'

/**
 * ReportGeneratorClient.tsx
 *
 * 📌 CSR CONCEPT:
 *    'use client' marca este componente como Client Component.
 *    Ele e todos os seus filhos que não tenham 'use server' rodam
 *    no browser. Aqui podemos usar:
 *    - useState, useEffect, useRef
 *    - event handlers (onClick, onSubmit)
 *    - APIs do browser (localStorage, window, etc.)
 *
 *    ⚠️  NÃO pode: acessar process.env sem NEXT_PUBLIC_, ler arquivos
 *         do servidor, usar bibliotecas Node.js puras.
 */

import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { FileText, Code2, FormInput } from 'lucide-react'
import { cn } from '@/lib/utils'
import { JsonInputTab } from '@/components/JsonInputTab'
import { FormInputTab } from '@/components/FormInputTab'
import { SSRExplainer } from '@/components/SSRExplainer'

type TabValue = 'json' | 'form'

export function ReportGeneratorClient() {
  const [activeTab, setActiveTab] = useState<TabValue>('json')

  return (
    <div className="animate-slide-up space-y-8">
      {/* Título da página */}
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-medium text-brand-700">
          <FileText className="h-3.5 w-3.5" />
          Gerador de Relatórios PDF
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Crie seu relatório profissional
        </h2>
        <p className="mt-2 text-slate-500">
          Escolha como prefere inserir os dados e gere um PDF com marca d&apos;água e brasão.
        </p>
      </div>

      {/* Abas de entrada */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabValue)}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Lista de abas */}
        <Tabs.List className="flex rounded-t-2xl border-b border-slate-200 bg-slate-50/80 p-1 gap-1">
          <TabTrigger value="json" active={activeTab === 'json'}>
            <Code2 className="h-4 w-4" />
            JSON / Upload
          </TabTrigger>
          <TabTrigger value="form" active={activeTab === 'form'}>
            <FormInput className="h-4 w-4" />
            Formulário
          </TabTrigger>
        </Tabs.List>

        {/* Conteúdo das abas */}
        <div className="p-6">
          <Tabs.Content value="json" className="outline-none">
            <JsonInputTab />
          </Tabs.Content>
          <Tabs.Content value="form" className="outline-none">
            <FormInputTab />
          </Tabs.Content>
        </div>
      </Tabs.Root>

      {/* Caixa explicativa SSR/CSR — propósito educacional */}
      <SSRExplainer />
    </div>
  )
}

// ---------------------------------------------------------------
// Sub-componente da aba
// ---------------------------------------------------------------
function TabTrigger({
  value,
  active,
  children,
}: {
  value: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        active
          ? 'bg-white text-brand-700 shadow-sm'
          : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
      )}
    >
      {children}
    </Tabs.Trigger>
  )
}

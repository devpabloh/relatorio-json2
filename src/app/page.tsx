

import { ReportGeneratorClient } from '@/components/ReportGeneratorClient'

// Dados estáticos lidos no servidor
const orgName = process.env.NEXT_PUBLIC_ORG_NAME ?? 'Gerador de Relatórios'
const showWatermark = process.env.NEXT_PUBLIC_SHOW_WATERMARK === 'true'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Hero Header — renderizado no servidor */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          {/* Brasão placeholder — em produção, use uma <Image> com next/image */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 shadow-md">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">{orgName}</h1>
            <p className="text-xs text-slate-500">GERAPE Sistema de Geração de Relatórios em PDF</p>
          </div>
          {showWatermark && (
            <span className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              Marca d&apos;água ativa
            </span>
          )}
        </div>
      </header>

      {/* Conteúdo interativo — Client Component */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <ReportGeneratorClient />
      </div>
    </main>
  )
}

/**
 * app/layout.tsx
 *
 * 📌 SSR CONCEPT:
 *    Este é um Server Component (padrão no App Router).
 *    Ele é renderizado UMA VEZ no servidor e enviado como HTML.
 *    Não tem JavaScript interativo — apenas estrutura e metadados.
 *
 *    ✅ Ideal para: <head>, fontes, providers globais sem estado
 */

import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Gerador de Relatórios',
    template: '%s | Gerador de Relatórios',
  },
  description: 'Gere relatórios profissionais em PDF a partir de dados JSON ou formulário.',
  keywords: ['relatório', 'PDF', 'gerador', 'JSON'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full bg-slate-50 antialiased">
        {children}
        {/*
          Toaster é um Client Component, mas como não precisa de
          props dinâmicas, o Next.js o trata de forma otimizada.
        */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}

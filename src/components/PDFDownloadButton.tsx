'use client'

import { useState } from 'react'
import { Download, Loader2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Report } from '@/lib/schemas'

interface PDFDownloadButtonProps {
  report: Report | null
  disabled?: boolean
}

export function PDFDownloadButton({ report, disabled }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleDownload() {
    if (!report) return

    setIsGenerating(true)

    try {
      /**
       * 📌 CSR → SSR handoff:
       *    O Client Component faz um fetch para a API Route (servidor).
       *    O servidor processa e devolve o PDF em binário.
       *    O browser recebe o Blob e aciona o download.
       */
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error ?? 'Erro ao gerar PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      try {
        const a = document.createElement('a')
        a.href = url
        a.download = `relatorio_${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } finally {
        URL.revokeObjectURL(url)
      }

      toast.success('PDF gerado e baixado com sucesso!')
    } catch (error) {
      console.error('[PDF Download]', error)
      toast.error(
        error instanceof Error ? error.message : 'Erro desconhecido ao gerar o PDF'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || isGenerating}
      className={cn(
        'inline-flex items-center gap-2.5 rounded-xl px-6 py-3',
        'text-sm font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        disabled || isGenerating
          ? 'cursor-not-allowed bg-slate-100 text-slate-400'
          : 'bg-brand-700 text-white shadow-md hover:bg-brand-800 hover:shadow-lg active:scale-95'
      )}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Gerando PDF...
        </>
      ) : (
        <>
          {disabled ? (
            <FileText className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {disabled ? 'Preencha os dados' : 'Baixar PDF'}
        </>
      )}
    </button>
  )
}

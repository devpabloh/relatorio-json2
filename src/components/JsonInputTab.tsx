'use client'

import { useState, useRef } from 'react'
import { Upload, Code2, FileJson, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn, safeParseJSON } from '@/lib/utils'
import { ReportSchema, REPORT_EXAMPLE_JSON, type Report } from '@/lib/schemas'
import { PDFDownloadButton } from '@/components/PDFDownloadButton'

export function JsonInputTab() {
  const [jsonText, setJsonText] = useState('')
  const [parsedReport, setParsedReport] = useState<Report | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ---- Validar o JSON digitado ----
  function validateJSON(raw: string) {
    if (!raw.trim()) {
      setParsedReport(null)
      setValidationError(null)
      return
    }

    const { data, error } = safeParseJSON<unknown>(raw)
    if (error) {
      setValidationError(error)
      setParsedReport(null)
      return
    }

    const result = ReportSchema.safeParse(data)
    if (!result.success) {
      const firstError = Object.entries(result.error.flatten().fieldErrors)[0]
      setValidationError(
        firstError ? `Campo "${firstError[0]}": ${firstError[1]?.[0]}` : 'JSON com estrutura inválida'
      )
      setParsedReport(null)
    } else {
      setValidationError(null)
      setParsedReport(result.data)
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setJsonText(value)
    validateJSON(value)
  }

  // ---- Carregar JSON de exemplo ----
  function loadExample() {
    const text = JSON.stringify(REPORT_EXAMPLE_JSON, null, 2)
    setJsonText(text)
    validateJSON(text)
    toast.success('Exemplo carregado!')
  }

  // ---- Upload de arquivo .json ----
  function handleFile(file: File) {
    if (!file.name.endsWith('.json')) {
      toast.error('Somente arquivos .json são aceitos')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setJsonText(text)
      validateJSON(text)
      toast.success(`Arquivo "${file.name}" carregado`)
    }
    reader.onerror = () => {
      toast.error(`Erro ao ler o arquivo "${file.name}"`)
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200',
          isDragging
            ? 'border-brand-400 bg-brand-50'
            : 'border-slate-200 bg-slate-50/50 hover:border-brand-300 hover:bg-brand-50/30'
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <FileJson className="mx-auto mb-2 h-8 w-8 text-brand-400" />
        <p className="text-sm font-medium text-slate-700">
          Arraste um arquivo <span className="text-brand-600">.json</span> aqui
        </p>
        <p className="mt-1 text-xs text-slate-400">ou clique para selecionar</p>
      </div>

      {/* Divisor */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">ou cole o JSON abaixo</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Textarea */}
      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Code2 className="h-4 w-4 text-slate-400" />
            JSON do relatório
          </label>
          <button
            onClick={loadExample}
            className="text-xs text-brand-600 underline-offset-2 hover:underline"
          >
            Carregar exemplo
          </button>
        </div>

        <textarea
          value={jsonText}
          onChange={handleTextChange}
          placeholder={`Cole seu JSON aqui...\n\nExemplo:\n${JSON.stringify({ title: 'Meu Relatório', sections: [] }, null, 2)}`}
          className={cn(
            'w-full resize-none rounded-lg border bg-white font-mono text-sm text-slate-800',
            'min-h-[280px] p-4 shadow-sm transition-colors placeholder:text-slate-300',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/40',
            validationError
              ? 'border-red-300 focus:border-red-400'
              : parsedReport
                ? 'border-emerald-300 focus:border-emerald-400'
                : 'border-slate-200 focus:border-brand-400'
          )}
          spellCheck={false}
        />

        {/* Feedback de validação */}
        {validationError && (
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {validationError}
          </div>
        )}
        {parsedReport && !validationError && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            JSON válido — {parsedReport.sections.length} seção(ões) detectada(s)
          </div>
        )}
      </div>

      {/* Botão de download */}
      <div className="flex justify-end">
        <PDFDownloadButton report={parsedReport} disabled={!parsedReport} />
      </div>
    </div>
  )
}

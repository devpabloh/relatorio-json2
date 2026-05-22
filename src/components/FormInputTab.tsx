'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ReportFormSchema, type ReportFormData, type Report } from '@/lib/schemas'
import { PDFDownloadButton } from '@/components/PDFDownloadButton'

export function FormInputTab() {
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({ 0: true })

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      author: '',
      organization: '',
      notes: '',
      sections: [
        {
          title: 'Nova Seção',
          items: [{ label: '', value: '', highlight: false }],
        },
      ],
    },
  })

  // useFieldArray: gerencia o array de seções dinamicamente
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({ control, name: 'sections' })

  const formData = watch()

  // Converte os dados do form para o tipo Report (para o PDF)
  const reportData: Report | null = (() => {
    const result = ReportFormSchema.safeParse(formData)
    return result.success ? result.data : null
  })()

  function toggleSection(idx: number) {
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-6">
      {/* ---- Informações gerais ---- */}
      <fieldset className="space-y-4">
        <legend className="mb-3 text-sm font-semibold text-slate-700">
          Informações do Relatório
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Título *"
            error={errors.title?.message}
          >
            <input
              {...register('title')}
              placeholder="Ex: Relatório Mensal de TI"
              className={inputClass(!!errors.title)}
            />
          </Field>

          <Field label="Subtítulo" error={errors.subtitle?.message}>
            <input
              {...register('subtitle')}
              placeholder="Ex: Referência: Maio/2026"
              className={inputClass(false)}
            />
          </Field>

          <Field label="Responsável" error={errors.author?.message}>
            <input
              {...register('author')}
              placeholder="Ex: Departamento de TI"
              className={inputClass(false)}
            />
          </Field>

          <Field label="Organização" error={errors.organization?.message}>
            <input
              {...register('organization')}
              placeholder="Ex: Prefeitura Municipal"
              className={inputClass(false)}
            />
          </Field>
        </div>
      </fieldset>

      {/* ---- Seções ---- */}
      <fieldset>
        <div className="mb-3 flex items-center justify-between">
          <legend className="text-sm font-semibold text-slate-700">
            Seções do Relatório *
          </legend>
          <button
            type="button"
            onClick={() => {
              const newIdx = sectionFields.length
              appendSection({ title: `Seção ${newIdx + 1}`, items: [{ label: '', value: '', highlight: false }] })
              setExpandedSections((prev) => ({ ...prev, [newIdx]: true }))
            }}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Nova seção
          </button>
        </div>

        <div className="space-y-3">
          {sectionFields.map((section, sIdx) => (
            <SectionCard
              key={section.id}
              sIdx={sIdx}
              expanded={expandedSections[sIdx] ?? false}
              onToggle={() => toggleSection(sIdx)}
              onRemove={sectionFields.length > 1 ? () => removeSection(sIdx) : undefined}
              register={register}
              control={control}
              errors={errors}
            />
          ))}
        </div>
      </fieldset>

      {/* ---- Observações ---- */}
      <Field label="Observações" error={errors.notes?.message}>
        <textarea
          {...register('notes')}
          placeholder="Notas ou observações adicionais..."
          rows={3}
          className={cn(inputClass(false), 'resize-none')}
        />
      </Field>

      {/* ---- Botão PDF ---- */}
      <div className="flex justify-end">
        <PDFDownloadButton report={reportData} disabled={!reportData} />
      </div>
    </form>
  )
}

// ---------------------------------------------------------------
// SectionCard: cada seção com seus itens
// ---------------------------------------------------------------
function SectionCard({
  sIdx,
  expanded,
  onToggle,
  onRemove,
  register,
  control,
  errors,
}: {
  sIdx: number
  expanded: boolean
  onToggle: () => void
  onRemove?: () => void
  register: ReturnType<typeof useForm<ReportFormData>>['register']
  control: ReturnType<typeof useForm<ReportFormData>>['control']
  errors: ReturnType<typeof useForm<ReportFormData>>['formState']['errors']
}) {
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: `sections.${sIdx}.items`,
  })

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header da seção */}
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={onToggle}
          className="text-slate-400 hover:text-slate-600"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <input
          {...register(`sections.${sIdx}.title`)}
          placeholder="Título da seção"
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Itens da seção */}
      {expanded && (
        <div className="border-t border-slate-100 p-4 pt-3">
          <div className="space-y-2">
            {itemFields.map((item, iIdx) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  {...register(`sections.${sIdx}.items.${iIdx}.label`)}
                  placeholder="Rótulo"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
                <input
                  {...register(`sections.${sIdx}.items.${iIdx}.value`)}
                  placeholder="Valor"
                  className="w-36 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
                <Controller
                  control={control}
                  name={`sections.${sIdx}.items.${iIdx}.highlight`}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      title="Destacar item"
                      className={cn(
                        'rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                        field.value
                          ? 'bg-brand-100 text-brand-700'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      )}
                    >
                      ★
                    </button>
                  )}
                />
                {itemFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(iIdx)}
                    className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => appendItem({ label: '', value: '', highlight: false })}
            className="mt-3 flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar item
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------
// Helpers de UI
// ---------------------------------------------------------------
function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-lg border px-3 py-2 text-sm text-slate-800 shadow-sm',
    'transition-colors placeholder:text-slate-300',
    'focus:outline-none focus:ring-2 focus:ring-brand-500/30',
    hasError
      ? 'border-red-300 focus:border-red-400'
      : 'border-slate-200 focus:border-brand-400'
  )
}

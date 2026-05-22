import { z } from 'zod'

// ---------------------------------------------------------------
// Schema de um item individual do relatório
// ---------------------------------------------------------------
export const ReportItemSchema = z.object({
  label: z.string().min(1, 'Label é obrigatório'),
  value: z.union([z.string(), z.number(), z.boolean()]),
  highlight: z.boolean().optional().default(false),
})

// ---------------------------------------------------------------
// Schema de uma seção do relatório
// ---------------------------------------------------------------
export const ReportSectionSchema = z.object({
  title: z.string().min(1, 'Título da seção é obrigatório'),
  items: z.array(ReportItemSchema).min(1, 'A seção deve ter ao menos 1 item'),
})

// ---------------------------------------------------------------
// Schema principal do relatório
// ---------------------------------------------------------------
export const ReportSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo'),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  date: z.string().optional(),
  organization: z.string().optional(),
  sections: z.array(ReportSectionSchema).min(1, 'Adicione ao menos uma seção'),
  notes: z.string().optional(),
})

// ---------------------------------------------------------------
// Schema do formulário (campos individuais, sem sections direto)
// ---------------------------------------------------------------
export const ReportFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo'),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  organization: z.string().optional(),
  notes: z.string().optional(),
  // sections são gerenciadas dinamicamente com useFieldArray
  sections: z.array(ReportSectionSchema).min(1, 'Adicione ao menos uma seção'),
})

// ---------------------------------------------------------------
// Tipos inferidos dos schemas
// ---------------------------------------------------------------
export type ReportItem = z.infer<typeof ReportItemSchema>
export type ReportSection = z.infer<typeof ReportSectionSchema>
export type Report = z.infer<typeof ReportSchema>
export type ReportFormData = z.infer<typeof ReportFormSchema>

// ---------------------------------------------------------------
// JSON de exemplo para o placeholder do textarea
// ---------------------------------------------------------------
export const REPORT_EXAMPLE_JSON = {
  title: 'Relatório de Desempenho Mensal',
  subtitle: 'Referência: Maio/2026',
  author: 'Departamento de TI',
  organization: 'Prefeitura Municipal',
  date: '22/05/2026',
  sections: [
    {
      title: 'Indicadores de Atendimento',
      items: [
        { label: 'Total de chamados abertos', value: 148 },
        { label: 'Chamados resolvidos', value: 132, highlight: true },
        { label: 'Taxa de resolução', value: '89.2%' },
        { label: 'Tempo médio de resposta', value: '4h 20min' },
      ],
    },
    {
      title: 'Infraestrutura',
      items: [
        { label: 'Servidores monitorados', value: 24 },
        { label: 'Uptime médio', value: '99.7%', highlight: true },
        { label: 'Incidentes críticos', value: 1 },
        { label: 'Backups realizados', value: 720 },
      ],
    },
  ],
  notes: 'Dados coletados pelo sistema de monitoramento interno.',
}

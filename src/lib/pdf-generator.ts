/**
 * pdf-generator.ts
 *
 * ⚠️  Este arquivo roda APENAS no servidor (Node.js).
 *     @react-pdf/renderer não funciona no browser.
 *
 * SSR/Server Action: a geração do PDF é feita na API Route,
 * o cliente apenas baixa o binário resultante.
 */

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  renderToBuffer,
} from '@react-pdf/renderer'
import type { Report } from '@/lib/schemas'
import { valueToString } from '@/lib/utils'

// ---------------------------------------------------------------
// Estilos do documento
// ---------------------------------------------------------------
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  // --- Cabeçalho ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#4338ca',
  },
  crest: {
    width: 56,
    height: 56,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  orgName: {
    fontSize: 9,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  reportTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1e1b4b',
    marginBottom: 2,
  },
  reportSubtitle: {
    fontSize: 10,
    color: '#6366f1',
  },
  // --- Meta info ---
  metaRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 8,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    color: '#374151',
  },
  // --- Seções ---
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#4338ca',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
    marginBottom: 8,
  },
  // --- Tabela de itens ---
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableRowHighlight: {
    backgroundColor: '#f0f4ff',
    borderRadius: 3,
  },
  tableRowEven: {
    backgroundColor: '#fafafa',
  },
  tableLabel: {
    flex: 1,
    color: '#374151',
    fontSize: 9,
  },
  tableValue: {
    color: '#111827',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  tableValueHighlight: {
    color: '#4338ca',
  },
  // --- Notas ---
  notesSection: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  notesTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.5,
  },
  // --- Rodapé ---
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  // --- Marca d'água ---
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watermarkText: {
    fontSize: 72,
    color: '#e5e7eb',
    opacity: 0.25,
    transform: 'rotate(-45deg)',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 10,
  },
})

// ---------------------------------------------------------------
// Componente do documento PDF
// ---------------------------------------------------------------
interface PDFDocumentProps {
  report: Report
  watermarkText?: string
  showWatermark?: boolean
  watermarkColor?: string
  crestUrl?: string
}

function PDFDocument({ report, watermarkText, showWatermark, watermarkColor, crestUrl }: PDFDocumentProps) {
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return React.createElement(
    Document,
    {
      title: report.title,
      author: report.author ?? 'Sistema de Relatórios',
      subject: report.subtitle ?? '',
      creator: 'Report Generator — Next.js',
    },
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },

      // ---- Marca d'água (renderizada primeiro = atrás de tudo) ----
      showWatermark && watermarkText
        ? React.createElement(
            View,
            { style: styles.watermarkContainer, fixed: true },
            React.createElement(Text, {
              style: [styles.watermarkText, watermarkColor ? { color: `#${watermarkColor}` } : {}],
            }, watermarkText)
          )
        : null,

      // ---- Cabeçalho ----
      React.createElement(
        View,
        { style: styles.header },
        crestUrl
          ? React.createElement(Image, { src: crestUrl, style: styles.crest })
          : null,
        React.createElement(
          View,
          { style: styles.headerText },
          report.organization
            ? React.createElement(Text, { style: styles.orgName }, report.organization)
            : null,
          React.createElement(Text, { style: styles.reportTitle }, report.title),
          report.subtitle
            ? React.createElement(Text, { style: styles.reportSubtitle }, report.subtitle)
            : null
        )
      ),

      // ---- Meta informações ----
      React.createElement(
        View,
        { style: styles.metaRow },
        report.author
          ? React.createElement(
              View,
              { style: styles.metaItem },
              React.createElement(Text, { style: styles.metaLabel }, 'Responsável'),
              React.createElement(Text, { style: styles.metaValue }, report.author)
            )
          : null,
        React.createElement(
          View,
          { style: styles.metaItem },
          React.createElement(Text, { style: styles.metaLabel }, 'Data'),
          React.createElement(
            Text,
            { style: styles.metaValue },
            report.date ?? today
          )
        )
      ),

      // ---- Seções ----
      ...report.sections.map((section, sIdx) =>
        React.createElement(
          View,
          { key: `section-${sIdx}`, style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, section.title),
          ...section.items.map((item, iIdx) =>
            React.createElement(
              View,
              {
                key: `item-${iIdx}`,
                style: [
                  styles.tableRow,
                  iIdx % 2 === 0 ? styles.tableRowEven : {},
                  item.highlight ? styles.tableRowHighlight : {},
                ],
              },
              React.createElement(Text, { style: styles.tableLabel }, item.label),
              React.createElement(
                Text,
                {
                  style: [
                    styles.tableValue,
                    item.highlight ? styles.tableValueHighlight : {},
                  ],
                },
                valueToString(item.value)
              )
            )
          )
        )
      ),

      // ---- Notas ----
      report.notes
        ? React.createElement(
            View,
            { style: styles.notesSection },
            React.createElement(Text, { style: styles.notesTitle }, 'Observações'),
            React.createElement(Text, { style: styles.notesText }, report.notes)
          )
        : null,

      // ---- Rodapé com número de página ----
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(
          Text,
          { style: styles.footerText },
          report.organization ?? 'Report Generator'
        ),
        React.createElement(Text, {
          style: styles.footerText,
          render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `Página ${pageNumber} de ${totalPages}`,
        })
      )
    )
  )
}

// ---------------------------------------------------------------
// Função principal: gera o Buffer do PDF
// ---------------------------------------------------------------
export async function generateReportPDF(
  report: Report,
  options?: {
    watermarkText?: string
    showWatermark?: boolean
    watermarkColor?: string
    crestUrl?: string
  }
): Promise<Buffer> {
  const element = React.createElement(PDFDocument, {
    report,
    watermarkText: options?.watermarkText ?? process.env.WATERMARK_TEXT ?? 'CONFIDENCIAL',
    showWatermark: options?.showWatermark ?? process.env.NEXT_PUBLIC_SHOW_WATERMARK === 'true',
    watermarkColor: options?.watermarkColor ?? process.env.WATERMARK_COLOR,
    crestUrl: options?.crestUrl,
  })

  const buffer = await renderToBuffer(element)
  return Buffer.from(buffer)
}

/**
 * app/api/generate-pdf/route.ts
 *
 * 📌 SSR CONCEPT:
 *    Esta é uma API Route do Next.js. Ela roda EXCLUSIVAMENTE no
 *    servidor (Node.js). O cliente envia o JSON do relatório via
 *    POST e recebe de volta o PDF em binário (application/pdf).
 *
 *    Por que no servidor?
 *    - @react-pdf/renderer usa APIs Node.js que não existem no browser
 *    - Segurança: configurações de marca d'água ficam no .env do servidor
 *    - Performance: a geração pesada não consome CPU do cliente
 */

import { NextRequest, NextResponse } from 'next/server'
import { ReportSchema } from '@/lib/schemas'
import { generateReportPDF } from '@/lib/pdf-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validação com Zod — rejeita dados inválidos antes de processar
    const parsed = ReportSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    // Gera o PDF no servidor
    const pdfBuffer = await generateReportPDF(parsed.data, {
      watermarkText: process.env.WATERMARK_TEXT,
      showWatermark: process.env.NEXT_PUBLIC_SHOW_WATERMARK === 'true',
    })

    // Retorna o binário do PDF com headers corretos
    const fileName = encodeURIComponent(
      `relatorio_${parsed.data.title.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`
    )

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[PDF Generation Error]', error)

    return NextResponse.json(
      {
        error: 'Erro interno ao gerar o PDF',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}

// GET para health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'PDF Generator API está funcionando',
    timestamp: new Date().toISOString(),
  })
}

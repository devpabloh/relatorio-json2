# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies (required before first run)
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Check ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier
npm run format:check # Check formatting without writing
```

### Docker

```bash
docker-compose up app                      # Production
docker-compose --profile dev up app-dev   # Development with hot-reload
```

### Environment setup

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_ORG_NAME` | Organization name in the header | `"Gerador de Relatórios"` |
| `NEXT_PUBLIC_SHOW_WATERMARK` | Enable watermark | `"true"` |
| `WATERMARK_TEXT` | Watermark text (server-only) | `"CONFIDENCIAL"` |
| `NEXT_PUBLIC_APP_URL` | App base URL | `"http://localhost:3000"` |

## Architecture

### Request flow

The user interacts with Client Components in the browser. When generating a PDF, `PDFDownloadButton` sends a `POST` to `/api/generate-pdf` with the report JSON. The API Route validates the payload with Zod, calls `generateReportPDF` (server-only), and streams back a binary PDF.

```
Browser (Client Components)
  └─ POST /api/generate-pdf  (JSON body)
       └─ ReportSchema.safeParse()       ← src/lib/schemas.ts
       └─ generateReportPDF()            ← src/lib/pdf-generator.ts
            └─ @react-pdf/renderer       ← Node.js only
       └─ Returns: application/pdf buffer
```

### SSR / CSR boundary

| File | Type | Reason |
|---|---|---|
| `src/app/layout.tsx` | Server | HTML shell, metadata |
| `src/app/page.tsx` | Server | Reads `process.env`, renders static header |
| `src/app/api/generate-pdf/route.ts` | Server | `@react-pdf/renderer` is Node.js only |
| `src/components/ReportGeneratorClient.tsx` | Client | `useState` for active tab |
| `src/components/JsonInputTab.tsx` | Client | FileReader, drag-and-drop, real-time validation |
| `src/components/FormInputTab.tsx` | Client | `useFieldArray`, react-hook-form |
| `src/components/PDFDownloadButton.tsx` | Client | `fetch`, `URL.createObjectURL` |

`@react-pdf/renderer` must never be imported in Client Components. It is excluded from the client bundle via `serverComponentsExternalPackages` in [next.config.ts](next.config.ts).

### Data schema

All report data is typed through Zod in `src/lib/schemas.ts`. The same schemas validate both the API Route input and the react-hook-form in `FormInputTab`. The `ReportSchema` is the canonical type; `ReportFormSchema` is identical except it is used as the form's type with `useFieldArray` managing `sections` dynamically.

### PDF generation

`src/lib/pdf-generator.ts` uses `React.createElement` directly (no JSX) to build the `@react-pdf/renderer` document tree, then calls `renderToBuffer`. Styles are defined via `StyleSheet.create` at the module level. The watermark is rendered first so it appears behind all content; `fixed: true` repeats it on every page.

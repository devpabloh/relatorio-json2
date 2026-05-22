# 📄 Report Generator

Sistema de geração de relatórios em PDF com marca d'água e brasão, construído com **Next.js 15**, **TypeScript**, **Zod**, **Tailwind CSS** e **@react-pdf/renderer**.

## ✨ Funcionalidades

- 📂 **Upload de arquivo JSON** — arraste ou selecione
- ✏️ **Cola JSON direto** no textarea com validação em tempo real
- 📝 **Formulário dinâmico** — adicione seções e itens visualmente
- 💧 **Marca d'água** no PDF (configurável via `.env`)
- 🏛️ **Brasão** no cabeçalho do PDF
- 🎓 **Explainer educacional** sobre SSR/CSR integrado na UI

## 🚀 Começando

### Pré-requisitos
- Node.js 20+
- npm ou yarn

### Instalação

```bash
# Clone e instale
git clone <repo>
cd report-generator
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com seus valores

# Inicie em desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

### Com Docker

```bash
# Produção
docker-compose up app

# Desenvolvimento (hot-reload)
docker-compose --profile dev up app-dev
```

## 📁 Estrutura

```
src/
├── app/
│   ├── layout.tsx              ← Server Component (SSR) — HTML base
│   ├── page.tsx                ← Server Component (SSR) — lê .env
│   ├── globals.css
│   └── api/
│       └── generate-pdf/
│           └── route.ts        ← API Route (Servidor) — gera PDF
├── components/
│   ├── ReportGeneratorClient.tsx  ← "use client" — abas
│   ├── JsonInputTab.tsx           ← "use client" — upload/textarea
│   ├── FormInputTab.tsx           ← "use client" — form dinâmico
│   ├── PDFDownloadButton.tsx      ← "use client" — fetch + download
│   └── SSRExplainer.tsx           ← "use client" — educacional
└── lib/
    ├── schemas.ts              ← Zod schemas + tipos
    ├── pdf-generator.ts        ← Geração do PDF (Node.js apenas)
    └── utils.ts                ← Helpers compartilhados
```

## 🧪 SSR vs CSR nesta aplicação

| Arquivo | Tipo | Por quê |
|---|---|---|
| `layout.tsx` | **Server** | HTML base, metadados, sem interatividade |
| `page.tsx` | **Server** | Lê `process.env`, renderiza header estático |
| `api/generate-pdf/route.ts` | **Server** | `@react-pdf` é Node.js only |
| `ReportGeneratorClient.tsx` | **Client** | `useState` para aba ativa |
| `JsonInputTab.tsx` | **Client** | FileReader, drag-and-drop, validação |
| `FormInputTab.tsx` | **Client** | `useFieldArray`, react-hook-form |
| `PDFDownloadButton.tsx` | **Client** | `fetch`, `URL.createObjectURL` |

## 📋 Formato do JSON

```json
{
  "title": "Relatório de Desempenho",
  "subtitle": "Referência: Maio/2026",
  "author": "Departamento de TI",
  "organization": "Prefeitura Municipal",
  "date": "22/05/2026",
  "sections": [
    {
      "title": "Indicadores",
      "items": [
        { "label": "Total atendimentos", "value": 148 },
        { "label": "Taxa de resolução", "value": "89%", "highlight": true }
      ]
    }
  ],
  "notes": "Observações opcionais aqui."
}
```

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `NEXT_PUBLIC_ORG_NAME` | Nome da organização no header | `"Gerador de Relatórios"` |
| `NEXT_PUBLIC_SHOW_WATERMARK` | Ativa marca d'água | `"true"` |
| `WATERMARK_TEXT` | Texto da marca d'água | `"CONFIDENCIAL"` |
| `NEXT_PUBLIC_APP_URL` | URL base da app | `"http://localhost:3000"` |

## 🛠️ Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia em produção
npm run lint         # Checar ESLint
npm run lint:fix     # Corrigir ESLint
npm run format       # Formatar com Prettier
npm run format:check # Checar formatação
```

## 📦 Tecnologias

- **Next.js 15** (App Router) — framework SSR/CSR
- **TypeScript** — tipagem estática
- **Zod** — validação de schemas
- **Tailwind CSS** — estilização utilitária
- **@react-pdf/renderer** — geração de PDF no servidor
- **react-hook-form** — formulários com validação
- **Radix UI** — componentes acessíveis (Tabs)
- **Sonner** — notificações toast
- **Lucide React** — ícones
- **ESLint + Prettier** — qualidade de código
- **Docker** — containerização
# relatorio-json2

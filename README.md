# ApplyFlow

ApplyFlow helps you manage and speed up job applications. Upload your resume (PDF) once, and the browser extension keeps it handy in a persistent side panel while you browse job sites — parsing your resume, parsing job postings, matching the two, and drafting answers to application questions with AI. Jobs you apply to are saved to a tracker you can review in a companion web dashboard.

## Screenshots

| Resume | Ask AI | Match |
| --- | --- | --- |
| ![Resume view](docs/screenshots/resume.png) | ![Ask AI view](docs/screenshots/ask-ai.png) | ![Match view](docs/screenshots/match.png) |

- **Resume** — parsed resume broken into editable, copyable sections (contact, experience, projects, …).
- **Ask AI** — paste a job description, parse it, and generate tailored answers to application questions.
- **Match** — score your resume against a posting, with strengths and missing skills.
- **Job & tracking** — grab the posting from the active tab (or paste it), then save it to your tracker with one click.

### Application dashboard

The companion web app lists every job you've tracked from the extension. Filter by status, update where each application stands, open the original posting, or remove it.

![Applications dashboard](docs/screenshots/dashboard.png)

## Features

- **AI resume parsing** — upload a PDF and get a structured, editable resume (contact, experience, projects, education, skills).
- **AI job parsing** — grab the posting from your active browser tab or paste it manually; ApplyFlow extracts title, company, responsibilities, requirements, nice-to-haves, and skills.
- **Resume ↔ job matching** — score your resume against a posting and surface strengths and missing skills.
- **AI answer drafting** — generate tailored answers to application questions, grounded in your resume and the job description.
- **Application tracking** — save jobs you've applied to (deduplicated by URL) with status, company, and applied date.
- **Web dashboard** — browse, filter, paginate, re-status, and delete tracked applications.

## Status

Active development. The extension (resume/job parsing, Ask AI, Match, tracking), the backend API (AI endpoints + Postgres persistence), and the application dashboard are all functional.

## Tech stack

| Area | Tech |
| --- | --- |
| Monorepo | pnpm workspaces |
| Extension | Manifest V3, React 19, TypeScript, Vite 8 |
| Extension tooling | [`@crxjs/vite-plugin`](https://crxjs.dev/vite-plugin) for MV3 builds + HMR |
| Web dashboard | Next.js 16, React 19, TanStack Query, axios |
| Styling | Tailwind CSS v4, shadcn/ui (Radix UI), Lucide icons |
| API | Node, Express 5, TypeScript (via `tsx`) |
| AI | Vercel AI SDK (`ai`) + OpenAI (`@ai-sdk/openai`) |
| Database | PostgreSQL via Drizzle ORM (`drizzle-orm` / `drizzle-kit`) |
| Shared | Zod schemas (shared validation across extension, web, and API) |

## Repository layout

```
applyflow/
├── apps/
│   ├── extension/      # MV3 browser extension (React + Vite + CRXJS)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── resume/      # resume, job, Ask AI, Match, tracking views
│   │   │   │   └── ui/          # shadcn/ui components
│   │   │   ├── lib/
│   │   │   │   ├── api/         # TanStack Query hooks (queries + mutations)
│   │   │   │   ├── page-content.ts  # reads the active tab's page text
│   │   │   │   └── storage.ts        # persisted resume/job state
│   │   │   ├── App.tsx          # side panel root
│   │   │   ├── main.tsx         # React entry, mounts into #root
│   │   │   └── background.ts    # service worker (opens side panel on icon click)
│   │   └── manifest.config.ts   # MV3 manifest (CRXJS)
│   ├── api/            # Express API (AI endpoints + application persistence)
│   │   ├── src/
│   │   │   ├── db/              # Drizzle client + schema
│   │   │   ├── prompts/         # system prompts for parse/match/answer
│   │   │   ├── routes/          # ai, job, resume, applications
│   │   │   └── index.ts
│   │   └── drizzle.config.ts    # Drizzle Kit config
│   └── web/            # Next.js application dashboard
│       ├── app/                 # pages, layout, providers
│       └── lib/                 # API client + TanStack Query hooks
└── packages/
    └── schema/        # Shared Zod schemas (resume, job, applications)
```

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/resume/parse` | Parse an uploaded resume PDF into structured data |
| `POST` | `/job/parse` | Parse raw job-posting text into a structured job description |
| `POST` | `/ai/answer` | Draft an answer to an application question |
| `POST` | `/ai/cover-letter` | Generate a tailored cover letter from resume + job description |
| `POST` | `/ai/match` | Score a resume against a job description |
| `GET` | `/applications` | List tracked applications (paginated, filterable by status) |
| `GET` | `/applications/by-url` | Look up a tracked application by job URL |
| `POST` | `/applications` | Track an application (upsert by URL) |
| `PATCH` | `/applications/:id` | Update an application's status |
| `DELETE` | `/applications/:id` | Remove a tracked application |

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database
- An OpenAI API key

### Install

```bash
pnpm install
```

### Configure the API

Copy the example env file and fill in your values:

```bash
cp apps/api/.env.example apps/api/.env
```

```
PORT=3001
OPENAI_API_KEY=sk-...
DATABASE_URL=postgres://user:password@localhost:5432/applyflow
```

Apply the database schema:

```bash
pnpm --filter api db:push
```

### Develop the extension

```bash
pnpm dev:extension
```

Then load it into a Chromium browser:

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select `apps/extension/dist`.
4. Click the ApplyFlow toolbar icon to open the side panel.

> Note: changes to `manifest.config.ts` or `background.ts` require clicking the refresh icon on the extension card in `chrome://extensions`. UI changes hot-reload automatically.

### Develop the API

```bash
pnpm dev:api
```

### Develop the web dashboard

```bash
pnpm dev:web
```

The dashboard runs on `http://localhost:3002` and talks to the API at `http://localhost:3001` (override with `NEXT_PUBLIC_API_URL`).

### Run everything

```bash
pnpm dev
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run all workspaces in dev mode |
| `pnpm dev:extension` | Run the extension dev server (CRXJS) |
| `pnpm dev:api` | Run the API dev server |
| `pnpm dev:web` | Run the web dashboard dev server |
| `pnpm --filter applyflow-extension build` | Production build of the extension |
| `pnpm --filter api db:generate` | Generate Drizzle migrations from the schema |
| `pnpm --filter api db:migrate` | Apply Drizzle migrations |
| `pnpm --filter api db:push` | Push the schema directly to the database |

## Browser support

The side panel API requires Chrome 114+ (or Chromium-based browsers like Edge, Brave, Arc). Firefox and Safari are not currently supported.

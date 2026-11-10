# CABGen Frontend

[Portuguese Version (Versão em Português)](./README.md)

Front-end of the **CABGen** platform, developed with **Next.js** (App Router).
This project is a rewrite of the front-end for the [CABGen](https://cabgen.fiocruz.br/pt) website, focusing on UX, internationalization, accessibility, and code organization.

## Table of Contents

1. [Technologies](#technologies)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Frontend](#running-the-frontend)
7. [Docker](#docker)
8. [Internationalization (i18n)](#internationalization-i18n)
9. [Middlewares](#middlewares)
10. [Code Standards](#code-standards)

## Technologies

- [Next.js](https://nextjs.org/) `^15.3` (App Router, standalone output)
- [React](https://react.dev/) `^19.0`
- [TypeScript](https://www.typescriptlang.org/) `^5.7`
- [Tailwind CSS](https://tailwindcss.com/) `^3.4` + [shadcn/ui](https://ui.shadcn.com/) components ([Radix UI](https://www.radix-ui.com/))
- [Redux Toolkit](https://redux-toolkit.js.org/) + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Recharts](https://recharts.org/) and [react-leaflet](https://react-leaflet.js.org/) for visualizations
- [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [react-window](https://react-window.vercel.app/) (virtualized tables)
- [Docker](https://www.docker.com/) (multi-stage, `node:24-alpine`)

## Features

- **Internationalization (PT/EN/ES)** — localized routes (`[lang]`), complete dictionaries, and automatic language negotiation in the middleware (`Accept-Language`/cookie/URL). Portuguese is the default language and has no URL prefix; `/en` and `/es` do.
- **Authentication** — login, registration, token-based password recovery and reset, e-mail confirmation, and httpOnly cookie sessions with **automatic token refresh on any 401** (centralized in RTK Query).
- **Route protection** — `/account/*` requires a session (server-side redirect to `/login`); `/account/admin/*` requires the `Admin` role (404 for non-admins).
- **Collaborator area** (`/account`) — overview with statistics and 6 charts of the user's analyses; samples with single upload, **`xlsx` template for bulk table submission**, and a detail modal; analyses with ZIP/FastQC downloads and **batch TSV (up to 50)** with double-click blocking; history visualization.
- **Admin dashboard** (`/account/admin`) — management of users, samples, analyses, origins, sequencers, laboratories, sample sources, microorganisms, health services, tickets, and audit; metrics dashboard with 10 charts (status/types/duration/queue/countries/species/genes/monthly/network) and dashboard TSV download.
- **Data tables** — server-side pagination, search and filters, client-side sorting, row selection with checkboxes, and **virtualization** (via `react-window`) to handle thousands of rows.
- **Binary downloads via services** — every download (`xlsx` template, TSVs, ZIP, FastQC) goes through RTK Query endpoints, guaranteeing `Accept-Language` (localized files) and automatic reauthentication.
- **Light/dark mode** — `next-themes` with system preference and persistence, adapted throughout the UI.

- **Polished UI states** — loading (spinners/skeletons), disabled with double-click blocking, translated error toasts, persistent errors, and feedback on every async action.
- **Responsive and accessible** — breakpoints from `xs` to `2xl`, mobile drawer navigation, semantic HTML, `aria-label`s, and `prefers-reduced-motion` respected.

## Project Structure

```bash
.
├── public/                  # Images and logos used in the UI
├── src/
│   ├── app/[lang]/          # App Router routes per language
│   │   ├── account/         # Authenticated area (collaborator + admin)
│   │   ├── about|network|dashboard|contact   # Public pages
│   │   ├── login|register|forgot-password|reset-password  # Authentication
│   │   └── layout.tsx       # Root layout (Menu + Footer + Providers)
│   ├── components/          # Components per page/section
│   │   ├── Account/         # Collaborator + Admin (Admin/)
│   │   ├── General/         # Generic (Modal, DataTable, Pagination, SmartSelect…)
│   │   ├── ui/              # shadcn/ui primitives
│   │   └── Home|About|Network|… # Public pages
│   ├── dictionaries/        # i18n dictionaries (languages/pt|en|es.ts)
│   ├── middlewares/         # Next middleware chain (chain)
│   ├── redux/               # Store + AuthContext + services (RTK Query per domain)
│   ├── styles/              # Class tokens (tailwind_classes.ts)
│   ├── utils/               # Helpers (toast, blob download, server-side request)
│   └── i18n/                # Locale config
├── Dockerfile               # Multi-stage build (standalone)
├── docker-compose.yaml      # Deployment (Traefik in production)
└── next.config.mjs
```

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 20` (build/runtime images use Node 24)
- npm

### Steps

```bash
git clone https://github.com/CABGenOrg/cabgen_frontend.git
cd cabgen_frontend
npm ci
```

## Configuration

The API URL is set via `NEXT_PUBLIC_API_URL`, and the application reads additional server-side routes from `.env` (loaded into the container via `env_file`). Create a `.env` file in the project root:

```env
# Build (inlined into the client)
NEXT_PUBLIC_API_URL=    # API URL used by the browser. E.g.: http://localhost:8080/api

# Runtime (server-side)
BACKEND_MAINTENANCE=    # "true" enables global maintenance mode (middleware)
BLOCKED_URLS=           # Comma-separated list of blocked URLs (middleware)
MICROREACT_URL=         # URL of the Microreact dashboard used on the Dashboard page
NEW_DOMAIN_WARNING=     # "true" shows the new-domain warning banner on the home page
```

> **Note:** `NEXT_PUBLIC_API_URL` is a **build-time** `ARG`: changing its value requires rebuilding the image (Docker injects it via `build.args` in `docker-compose.yaml`).

## Running the Frontend

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (PT, no prefix) or `/en` and `/es` for the other languages.

### Production (manual)

```bash
npm run build
npm start
```

### Docker

```bash
docker compose up -d --build
```

- The service exposes port `${PORT:-3000}` through `docker-compose.override.yaml`.
- `NEXT_PUBLIC_API_URL` is passed as `build.args`.
- In production, `docker-compose.yaml` registers the container in Traefik (`FRONTEND_HOST`) with TLS and the crowdsec middleware.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (standalone) |
| `npm start` | Serves the production build |
| `npm run lint` | ESLint (`next` config) |

## Internationalization (i18n)

- Locales: `pt` (default), `en`, `es`.
- Per-language routes in `src/app/[lang]/`; the middleware resolves the language from URL → `NEXT_LOCALE` cookie → `Accept-Language` header and rewrites prefixless requests to the default language.
- Dictionaries in `src/dictionaries/languages/{pt,en,es}.ts` (server + client via `getTranslateServer`/`getTranslateClient`).
- RTK Query injects `Accept-Language` into **every** request (binary downloads included), guaranteeing localized labels and files.

## Middlewares

Chain executed by `src/middleware.ts` (`src/middlewares/chain.ts`), in this order:

| Middleware | Role |
| --- | --- |
| `blockedURLsMiddleware` | Blocks URLs listed in `BLOCKED_URLS` (read from envs per request) |
| `authMiddleware` | Requires a session for `/account/*` (server-side redirect to `/login`; the `?expired=1` signal prevents loops) |
| `maintenanceMiddleware` | Enables global maintenance mode when `BACKEND_MAINTENANCE=true` |
| `languageMiddleware` | Resolves/rewrites the language and propagates `x-locale` + `NEXT_LOCALE` cookie |

## Code Standards

- **Strict TypeScript** — no `any`; inference where obvious, explicit contracts (types in services/shared).
- **Data layer** — each API domain gets an RTK Query service (`src/redux/services/**`) with request/response types, invalidation tags, and automatic `Accept-Language`. Components consume generated hooks, never manual `fetch` (except `handleServerUser.ts` for Server Components).
- **UI** — class tokens consolidated in `src/styles/tailwind_classes.ts` (`section_spacing`, `input_class`, etc.); shadcn/ui components in `src/components/ui`; forms with react-hook-form + Zod (locale-translated `validation.required`).

- **UI states** — every interactive element has `loading`, `disabled` (with double-click blocking on expensive actions), translated `error`, and feedback (toast/Message).
- **Before finishing** work: `npx tsc --noEmit` and `npm run build` must pass (the build closes ~87 static pages).

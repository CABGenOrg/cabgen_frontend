# CABGen Frontend

[English Version](./README.en.md)

Front-end da plataforma **CABGen**, desenvolvido em **Next.js** (App Router).
Este projeto é a reescrita do front-end do site [CABGen](https://cabgen.fiocruz.br/pt), com foco em UX, internacionalização, acessibilidade e organização de código.

## Índice

1. [Tecnologias](#tecnologias)
2. [Funcionalidades](#funcionalidades)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Instalação](#instalação)
5. [Configuração](#configuração)
6. [Executando o Frontend](#executando-o-frontend)
7. [Docker](#docker)
8. [Internacionalização (i18n)](#internacionalização-i18n)
9. [Middlewares](#middlewares)
10. [Padrões de Código](#padrões-de-código)

## Tecnologias

- [Next.js](https://nextjs.org/) `^15.3` (App Router, output standalone)
- [React](https://react.dev/) `^19.0`
- [TypeScript](https://www.typescriptlang.org/) `^5.7`
- [Tailwind CSS](https://tailwindcss.com/) `^3.4` + componentes [shadcn/ui](https://ui.shadcn.com/) ([Radix UI](https://www.radix-ui.com/))
- [Redux Toolkit](https://redux-toolkit.js.org/) + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Recharts](https://recharts.org/) e [react-leaflet](https://react-leaflet.js.org/) para visualizações
- [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [react-window](https://react-window.vercel.app/) (tabelas virtualizadas)
- [Docker](https://www.docker.com/) (multi-stage, `node:24-alpine`)

## Funcionalidades

- **Internacionalização (PT/EN/ES)** — rotas localizadas (`[lang]`), dicionários completos e negociação automática de idioma no middleware (`Accept-Language`/cookie/URL). PT é o idioma padrão e não tem prefixo na URL; `/en` e `/es` têm.
- **Autenticação** — login, registro, recuperação e redefinição de senha por token, confirmação de e-mail e sessão via cookies httpOnly com **refresh automático do token em qualquer 401** (centralizado no RTK Query).
- **Proteção de rotas** — `/account/*` exige sessão (redirect server-side para `/login`); `/account/admin/*` exige role `Admin` (404 para não-admin).
- **Área do colaborador** (`/account`) — overview com estatísticas e 6 gráficos das análises do usuário; amostras com upload individual, **template `xlsx` para envio em tabela (bulk)** e modal de detalhes; análises com downloads ZIP/FastQC e **TSV em lote (até 50)** com bloqueio anti double-click; visualização do histórico.
- **Painel administrativo** (`/account/admin`) — gerenciamento de usuários, amostras, análises, origens, sequenciadores, laboratórios, fontes de amostra, microorganismos, serviços de saúde, tickets e auditoria; dashboard de métricas com 10 gráficos (status/tipos/duração/fila/países/espécies/genes/mensal/rede) e download TSV do dashboard.
- **Tabelas de dados** — paginação server-side, busca e filtros server-side, ordenação client-side, seleção de linhas com checkboxes e **virtualização** (via `react-window`) para lidar com milhares de linhas.
- **Downloads binários via services** — todos os downloads (template `xlsx`, TSVs, ZIP, FastQC) passam pelos endpoints RTK Query, garantindo `Accept-Language` (arquivos localizados) e reautenticação automática.
- **Modo claro/escuro** — `next-themes` com preferência do sistema e persistência, adaptado em toda a interface.
- **Estado da UI melhorado** — loading (spinners/skeletons), disabled com bloqueio de cliques duplos, toasts de erro, erros persistentes e feedback em todas as ações assíncronas.
- **Responsivo e acessível** — breakpoints de `xs` a `2xl`, navegação drawer no mobile, HTML semântico, `aria-label`s e `prefers-reduced-motion` respeitado.

## Estrutura do Projeto

```bash
.
├── public/                  # Imagens e logos usados na UI
├── src/
│   ├── app/[lang]/          # Rotas App Router por idioma
│   │   ├── account/         # Área autenticada (colaborador + admin)
│   │   ├── about|network|dashboard|contact   # Páginas públicas
│   │   ├── login|register|forgot-password|reset-password  # Autenticação
│   │   └── layout.tsx       # Layout raiz (Menu + Footer + Providers)
│   ├── components/          # Componentes por página/seção
│   │   ├── Account/         # Colaborador + Admin (Admin/)
│   │   ├── General/         # Genéricos (Modal, DataTable, Pagination, SmartSelect…)
│   │   ├── ui/              # Primitivos shadcn/ui
│   │   └── Home|About|Network|… # Páginas públicas
│   ├── dictionaries/        # Dicionários i18n (languages/pt|en|es.ts)
│   ├── middlewares/         # Cadeia de middlewares do Next (chain)
│   ├── redux/               # Store + AuthContext + services (RTK Query por domínio)
│   ├── styles/              # Class tokens (tailwind_classes.ts)
│   ├── utils/               # Helpers (toast, blob download, requisição server-side)
│   └── i18n/                # Config de locales
├── Dockerfile               # Build multi-stage (standalone)
├── docker-compose.yaml      # Deploy (Traefik em produção)
└── next.config.mjs
```

## Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) `>= 20` (imagens de build/uso usam Node 24)
- npm

### Passos

```bash
git clone https://github.com/CABGenOrg/cabgen_frontend.git
cd cabgen_frontend
npm ci
```

## Configuração

A URL da API é definida em `NEXT_PUBLIC_API_URL` e a aplicação lê rotas server-side adicionais do `.env` (carregado no container via `env_file`). Crie um arquivo `.env` na raiz:

```env
# Build (vira inlined no cliente)
NEXT_PUBLIC_API_URL=    # URL da API usada pelo browser. Ex: http://localhost:8080/api

# Runtime (server-side)
BACKEND_MAINTENANCE=    # "true" ativa o modo manutenção global (middleware)
BLOCKED_URLS=           # Lista separada por vírgula de URLs bloqueadas (middleware)
MICROREACT_URL=         # URL do dashboard Microreact usado na página Dashboard
NEW_DOMAIN_WARNING=     # "true" exibe o banner de aviso de novo domínio na home
```

> **Nota:** `NEXT_PUBLIC_API_URL` é um **build-time** `ARG`: mudar o valor exige rebuild da imagem (Docker injeta via `build.args` no `docker-compose.yaml`).

## Executando o Frontend

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) (PT, sem prefixo) ou `/en` e `/es` para os outros idiomas.

### Produção (manual)

```bash
npm run build
npm start
```

### Docker

```bash
docker compose up -d --build
```

- O serviço expõe a porta `${PORT:-3000}` através do `docker-compose.override.yaml`.
- `NEXT_PUBLIC_API_URL` é passado como `build.args`.
- Em produção, o `docker-compose.yaml` registra o container no Traefik (`FRONTEND_HOST`) com TLS e middleware crowdsec.

### Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (standalone) |
| `npm start` | Serve o build de produção |
| `npm run lint` | ESLint (config `next`) |

## Internacionalização (i18n)

- Locales: `pt` (padrão), `en`, `es`.
- Rotas por idioma em `src/app/[lang]/`; o middleware resolve o idioma por URL → cookie `NEXT_LOCALE` → header `Accept-Language` e reescreve requisições sem prefixo para o padrão.
- Dicionários em `src/dictionaries/languages/{pt,en,es}.ts` (server + client via `getTranslateServer`/`getTranslateClient`).
- O RTK Query injeta `Accept-Language` em **todas** as requisições (binários incluídos), garantindo labels e arquivos localizados.

## Middlewares

Cadeia executada por `src/middleware.ts` (`src/middlewares/chain.ts`), nessa ordem:

| Middleware | Papel |
| --- | --- |
| `blockedURLsMiddleware` | Bloqueia URLs listadas em `BLOCKED_URLS` (lida das envs por request) |
| `authMiddleware` | Exige sessão para `/account/*` (server-side redirect para `/login`, sinal `?expired=1` evita loop) |
| `maintenanceMiddleware` | Ativa o modo manutenção global quando `BACKEND_MAINTENANCE=true` |
| `languageMiddleware` | Resolve/reescreve idioma e propaga `x-locale` + cookie `NEXT_LOCALE` |

## Padrões de Código

- **TypeScript estrito** — sem `any`; inferência onde é óbvia e contratos explícitos (`types` dos services/shared).
- **Camada de dados** — cada domínio da API tem um service RTK Query (`src/redux/services/**`), com tipos de request/response, tags de invalidação e `Accept-Language` automático. Componentes consomem hooks gerados, nunca `fetch` manual (exceto `handleServerUser.ts` para Server Components).
- **UI** — tokens de classes consolidados em `src/styles/tailwind_classes.ts` (`section_spacing`, `input_class`, etc.); componentes shadcn/ui em `src/components/ui`; formularios com react-hook-form + Zod (`validation.required` traduzido por idioma).
- **Estados da interface** — todo interativo tem `loading`, `disabled` (com anti double-click em ações caras), `error` traduzido e feedback (toast/Message).
- **Antes de concluir** um trabalho: `npx tsc --noEmit` e `npm run build` precisam passar (build fecha ~87 páginas estáticas).

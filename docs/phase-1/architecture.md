# Arquitetura — Fase 1

Visão geral do stack escolhido (monorepo):

- Frontend: Next.js + TypeScript (app router), React, CSS Modules + BEM, Playwright para E2E.
- Backend: NestJS + TypeScript, arquitetura modular (modules: auth, services, appointments, admin, notifications), class-validator / class-transformer.
- Banco de dados: PostgreSQL (UTC timestamps), Prisma como ORM + migrations.
- Jobs / agendamento: BullMQ + Redis (fila + delayed jobs para lembretes).
- E-mail transacional: SendGrid (configurável via env).
- Autenticação: JWT + refresh tokens (httpOnly cookie), roles (client, admin).
- Observability: Pino (logs JSON), Sentry para erros, health endpoints.
- CI/CD: GitHub Actions (lint, build, test, migration apply in deploy stage).
- Hosting: Frontend -> Vercel; Backend -> Render or Railway (prefer Render for easy Docker), Postgres -> Managed DB (Railway / Render DB / Supabase).

Decisões técnicas principais
- Monorepo para compartilhar types e DTOs entre frontend/backend.
- Use exclusion constraint em Postgres para prevenir double-booking (ver prisma + raw SQL migration).
- Permitir agendamento como convidada (guest booking) — cria um registro de contato mínimo e opcionalmente sugere criação de conta.
- Jobs de lembrete serão programados no momento da criação do agendamento (delayed jobs) e persistidos em Notification table.

Estrutura de pastas proposta (monorepo)

- /apps
  - /frontend (Next.js)
  - /backend (NestJS)
- /packages
  - /ui (componentes compartilhados)
  - /shared (tipos TS, dtos, schema validation)
- /prisma (schema.prisma + migrations)
- /docs (arquitetura, openapi, ERD)
- /infra (docker-compose, exemplos)
- .github (workflows)

Entrega desta fase
- ERD (mermaid + prisma schema)
- OpenAPI (skeleton)
- Estrutura de pastas recomendada
- Plano de migrations iniciais
- Plano de testes
- Checklist segurança & LGPD

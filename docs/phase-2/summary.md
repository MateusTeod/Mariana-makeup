# Fase 2 — Resumo do que foi desenvolvido

## Arquitetura
- Monorepo com Turborepo
- Frontend: Next.js 13+ (App Router) + TypeScript
- Backend: NestJS + TypeScript
- Banco: PostgreSQL + Prisma ORM
- Cache/Filas: Redis + BullMQ (preparado)
- Autenticacao: JWT + Argon2id

## Arquivos criados

### Root
- package.json (monorepo)
- turbo.json
- .gitignore
- .prettierrc
- .eslintrc.json
- docker-compose.dev.yml
- .env.example

### Backend (apps/backend)
- package.json, tsconfig.json, nest-cli.json
- src/main.ts — bootstrap com helmet, compression, rate-limit, CORS, validation
- src/app.module.ts — modulo raiz importando todos os modulos
- src/app.controller.ts, src/app.service.ts
- src/prisma/ — PrismaService global + PrismaModule
- src/auth/ — AuthModule completo:
  - AuthService (register, login, refresh com Argon2id)
  - AuthController (register, login, refresh, logout com httpOnly cookie)
  - JwtStrategy, JwtAuthGuard, RolesGuard, Roles decorator
  - DTOs (RegisterDto, LoginDto, RefreshDto) com validacao
- src/services/ — ServicesModule:
  - ServicesService (CRUD completo com slug generation)
  - ServicesController (public GET, admin CRUD)
  - DTOs (CreateServiceDto, UpdateServiceDto)
- src/appointments/ — AppointmentsModule:
  - AppointmentsService (create com transacao anti-double-booking, cancel com politica 24h)
  - AppointmentsController (create, me, upcoming, history, cancel, admin status)
  - CreateAppointmentDto
- src/availability/ — AvailabilityModule:
  - AvailabilityService (calculo de slots baseado em horarios + bloqueios + agendamentos)
  - AvailabilityController
- src/admin/ — AdminModule:
  - AdminService (dashboard com metricas, agenda, clientes)
  - AdminController (protegido por role ADMIN)
- src/notifications/ — NotificationsModule:
  - NotificationsService (logging de notificacoes, preparado para SendGrid)
- src/health/ — HealthModule:
  - HealthController (health check com teste de conexao DB)
- prisma/schema.prisma — modelo completo
- prisma/seed.ts — seed com admin, servicos, disponibilidade, cliente teste
- Dockerfile
- jest.config.ts

### Frontend (apps/frontend)
- package.json, tsconfig.json, next.config.js
- src/app/layout.tsx — layout raiz com meta tags e fonts
- src/app/globals.css — design system completo (tokens, BEM, componentes)
- src/app/page.tsx — pagina inicial (hero, servicos, CTA, footer)
- src/app/page.module.css — estilos BEM da home
- src/app/agendar/page.tsx — wizard de agendamento em 4 etapas
- src/app/login/page.tsx — tela de login
- src/app/cadastro/page.tsx — tela de cadastro
- src/app/minha-agenda/page.tsx — dashboard do cliente
- src/app/servicos/page.tsx — listagem de servicos
- src/lib/api.ts — cliente API tipado
- Dockerfile

### Packages
- packages/shared/ — tipos compartilhados (User, Service, Appointment, TimeSlot)
- packages/ui/ — placeholder para componentes compartilhados

## Como executar

### Pre-requisitos
- Node.js 20+
- Docker (para Postgres + Redis)

### Passos
1. Copiar .env.example para .env e ajustar variaveis
2. docker-compose -f docker-compose.dev.yml up -d
3. cd apps/backend && npm install && npx prisma migrate dev && npm run seed
4. cd apps/frontend && npm install
5. npm run dev (na raiz do monorepo)

### Credenciais de teste
- Admin: admin@mariana.com / Admin@123
- Cliente: cliente@teste.com / Client@123

## Decisoes tecnicas
- Argon2id para hashing de senhas (mais seguro que bcrypt)
- Transacao Prisma + check de sobreposicao para prevenir double-booking
- JWT com refresh token em httpOnly cookie
- Rate limiting global + protecao helmet
- Validacao com class-validator (backend) e Zod disponivel
- Health check endpoint para monitoramento
- Seed script para dados iniciais

## Proximos passos (Fase 3)
- Executar migrations do Prisma
- Testar endpoints manualmente
- Configurar CI/CD basico

Teste plano — Phase 1 -> Phase 3 (resumo)

Unit tests
- Availability calculation (edge cases: crossing midnight, service longer than remaining time)
- Overlap detection logic (backend helpers)
- Validators (email, phone, date sanity)

Integration tests
- Auth (register/login/refresh)
- Create appointment flow (including exclusion conflict)
- Services CRUD (admin)

E2E (Playwright)
- Guest booking flow: /agendar -> select service -> date -> time -> fill contact -> confirm -> receive confirmation
- User booking flow: register -> login -> book -> view "Minha Agenda"
- Admin flow: login -> view agenda -> confirm appointment

Test infra notes
- Use a test Postgres instance (docker) and run migrations before tests.
- Use a dedicated test Redis for BullMQ.
- Seed fixtures: 3 services with durations 30/60/90 minutes.

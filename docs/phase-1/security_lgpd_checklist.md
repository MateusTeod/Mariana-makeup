Segurança & LGPD checklist — Fase 1

Autenticação & Senhas
- [ ] Senhas armazenadas com Argon2id ou bcrypt (configurável)
- [ ] Forçar strong password rules no cadastro
- [ ] Implementar recaptcha/ rate limiting em endpoints sensíveis

API & Backend
- [ ] Validação e sanitização de todas entradas (Zod / class-validator)
- [ ] Proteção CSRF para sessões baseadas em cookies
- [ ] Rate limiting (IP + endpoint) para prevenção de brute force
- [ ] CORS estrito (origins permitidos)

Banco de dados
- [ ] Usar prepared statements / ORM seguro (Prisma)
- [ ] Exclusion constraint para evitar double-booking
- [ ] Backups e políticas de retenção

Logs & Observability
- [ ] Não logar dados sensíveis (senhas, full card numbers)
- [ ] Rotação e retenção de logs
- [ ] Integração com Sentry

LGPD
- [ ] Políticas: privacy + terms
- [ ] Consentimento para comunicações (opt-in para marketing)
- [ ] Endpoints para exportação / exclusão de dados pessoais
- [ ] Minimização de dados: registrar apenas campos necessários
- [ ] Registro de tratamento de dados (audit log)

Emails & Notificações
- [ ] Templates responsivos e opt-out em mensagens promocionais
- [ ] Armazenar preferências de contato no profile

Checklist operacional
- [ ] .env.example com variáveis necessárias
- [ ] Documentar responsabilidade por chaves (who has access)

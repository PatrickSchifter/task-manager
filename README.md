## TODO / Melhorias Futuras

- [ ] **PrismaService global**: Atualmente o `PrismaService` está declarado nos `providers` de cada módulo individualmente, criando múltiplas instâncias desnecessárias. Criar um `PrismaModule` com `@Global()` e registrá-lo no `AppModule` para compartilhar uma única instância em toda a aplicação.
- [ ] **RabbitMQ consumer separado**: O `MailConsumer` roda no mesmo processo da API (`@Controller()`) em vez de ser um worker independente. Em produção, separar consumer em processo próprio evita disputa de recursos e falhas no mail afetarem as rotas.
- [ ] **Health checks**: Adicionar `@nestjs/terminus` com checks de saúde para PostgreSQL, RabbitMQ e SMTP. Útil pra monitoramento e readiness/liveness em deploy.
- [ ] **Rate limiting na rota de forgot-password**: Apesar do RabbitMQ agilizar a resposta, não há proteção contra abuso. Adicionar `@nestjs/throttler` na rota `forgotPassword` pra evitar spam de e-mails.
- [ ] **Token de reset com TTL**: O JWT de `password-reset` não tem expiração explícita (`expiresIn`). Adicionar `expiresIn: '1h'` na assinatura do token.
- [ ] **Remover `console.log` e `console.error`**: `auth.service.ts:67` e `validate-resources-ids.interceptor.ts:40` têm `console.log/error`. Usar `Logger` do NestJS com levels adequados.
- [ ] **Validação de role-based access**: O `ProjectCollaborator` tem roles (VIEWER/EDITOR/OWNER) mas não há guards que restrinjam operações por role do colaborador (ex: VIEWER não deveria poder editar tarefas).
- [ ] **CloudnaryService desacoplada**: `CloudnaryService` está no `AppModule` mas só faria sentido num `UploadsModule`/`SharedModule`. O nome também está typo — `cloudinary` vs `cloudnary`.
- [ ] **Request ID / Correlation ID**: Propagar um correlation ID via middleware/interceptor pra rastrear requests entre a API e o consumer do RabbitMQ.
- [ ] **Tratamento de falhas no RabbitMQ**: Se o consumer falhar ao enviar o e-mail, não há dead-letter queue ou retry config. Configurar `prefetchCount`, DLQ e retry com backoff.
- [ ] **Seeding e fixtures**: Adicionar script de seed com dados fictícios pra facilitar dev e testes manuais.
- [ ] **`.DS_Store` no gitignore**: Tem um `src/.DS_Store` committed — adicionar `*.DS_Store` ao `.gitignore` e remover o arquivo do repositório.
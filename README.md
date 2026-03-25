## TODO / Melhorias Futuras

- [ ] **PrismaService global**: Atualmente o `PrismaService` está declarado nos `providers` de cada módulo individualmente, criando múltiplas instâncias desnecessárias. Criar um `PrismaModule` com `@Global()` e registrá-lo no `AppModule` para compartilhar uma única instância em toda a aplicação.
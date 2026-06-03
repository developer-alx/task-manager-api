<!--
Sync Impact Report
- Version change: none → 1.0.0
- Modified principles: placeholder template → five concrete principles
- Added sections: Database Governance, Development Workflow
- Removed sections: none
- Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: none
-->

# Task Manager API Constitution

## Core Principles

### I. Arquitetura em Camadas
Todas as funcionalidades devem seguir o fluxo: Routes → Controller → Service → Repository → Database.
Os Controllers não podem acessar o banco de dados diretamente.
Esta separação preserva clareza, testabilidade e reduz o acoplamento entre o transporte HTTP e a lógica de persistência.

### II. Responsabilidade Única
Cada camada tem uma responsabilidade principal:
- Routes definem endpoints e roteiam requisições.
- Controllers tratam entrada e saída HTTP.
- Services implementam regras de negócio.
- Repositories acessam dados.
- Database é responsável pela persistência física.
Esta disciplina evita responsabilidades misturadas e facilita refatorações seguras.

### III. Evolução Orientada por Features
Toda nova funcionalidade deve ser desenvolvida em etapas ordenadas:
1. Definir a necessidade.
2. Criar ou atualizar migration quando necessário.
3. Implementar o Repository.
4. Implementar o Service.
5. Implementar o Controller.
6. Registrar a rota.
7. Buildar a aplicação.
8. Rebuildar os containers.
9. Testar via Insomnia.
10. Atualizar a documentação.
Esse fluxo garante evolução incremental validada e reduz o risco de mudanças grandes sem controle.

### IV. Segurança de API
Rotas protegidas devem utilizar JWT por meio do `authMiddleware`.
Senhas e campos sensíveis nunca devem ser retornados em respostas da API.
Operações de atualização e remoção exigem regras explícitas de autorização antes de serem implementadas.
A segurança deve ser parte da arquitetura desde o início, não uma correção posterior.

### V. Validação e Documentação Obrigatórias
Nenhuma alteração é considerada concluída sem validação de build e implantação local.
O README deve refletir o estado atual da arquitetura do projeto.
Decisões arquiteturais relevantes devem ser registradas e documentadas.
A qualidade e consistência arquitetural são prioridades acima da velocidade de implementação.

## Database Governance
Toda alteração estrutural de banco de dados deve ser realizada via migrations usando `node-pg-migrate`.
Alterações manuais diretas no banco de dados devem ser evitadas.
O schema deve ser versionado e reproduzível a partir do código-fonte.

## Development Workflow
O fluxo mínimo obrigatório de validação é:
- `npm run build`
- `docker compose down`
- `docker compose build --no-cache`
- `docker compose up -d`
Após o deploy local, validar:
- endpoint no Insomnia;
- logs da aplicação;
- comportamento esperado da funcionalidade.
Implementar uma funcionalidade por vez e validar cada etapa antes de avançar.
Evitar alterações grandes sem testes intermediários.

## Governance
Esta Constituição orienta as práticas do projeto e tem prioridade sobre convenções implícitas.
Alterações no processo ou princípios devem ser documentadas e justificadas claramente.
Revisões devem verificar conformidade com a arquitetura em camadas, responsabilidade única, disciplina de migrations, segurança e documentação atualizada.

**Version**: 1.0.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-05-31

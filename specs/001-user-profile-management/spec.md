# Feature Specification: User Profile Management

**Feature Branch**: `[001-user-profile-management]`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "Evoluir o módulo Users para suportar perfil autenticado e futuras operações de gerenciamento de usuários. Próxima evolução sugerida Para um CRUD de usuários mais completo, implementar por etapas: Definir o comportamento desejado; GET /users deve listar todos os usuários e deve retornar dados do usuário autenticado Se for lista de todos os usuários, deve ser protegido e talvez limitado a admins. Repository adicionar findAll() para buscar todos os usuários. Adicionar findById(id: number) para buscar um usuário específico opcional: delete(id: number) para remoção opcional: update(id: number, ...) para alteração de dados Services ListUsersService GetUserByIdService UpdateUserService DeleteUserService manter padrão arquitetural Repository → Service → Controller Controller list deve chamar ListUsersService e retornar só os campos necessários talvez criar show/me para retornar dados do usuário autenticado delete (ou destroy) com validação de autorização possivelmente update para editar perfil Routes GET /users → userController.list GET /users/:id → userController.show PUT /users/:id → userController.update DELETE /users/:id → userController.delete proteger com authMiddleware definir se apenas o próprio usuário ou admin pode deletar/atualizar 4. Faz sentido implementar exclusão de usuários? Sim, faz sentido se: você quiser permitir que usuários apaguem sua conta ou se quiser suportar administração de usuários Mas é importante: definir regras de autorização não expor senha proteger a rota com JWT"

## User Scenarios & Testing (mandatory)

### User Story 1 - Authenticated user views own profile (Priority: P1)

Um usuário autenticado deve conseguir consultar seus próprios dados de perfil usando o endpoint de usuário.

**Why this priority**: Permitir que cada usuário veja seu perfil é a base de um módulo de gerenciamento de usuários e habilita futuras edições de conta.

**Independent Test**: Autenticar um usuário, chamar `GET /users/:id` com o próprio `id` e verificar que os dados retornados correspondem ao usuário autenticado, excluindo campos sensíveis.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado, **When** ele chama `GET /users/:id` com o próprio `id`, **Then** recebe um objeto de usuário contendo apenas campos públicos permitidos.
2. **Given** um usuário autenticado com `id` inválido ou inexistente, **When** ele chama `GET /users/:id`, **Then** recebe um `404 Not Found`.

---

### User Story 2 - Admin lists all users (Priority: P2)

Um usuário com permissão administrativa deve poder listar todos os usuários cadastrados.

**Why this priority**: A listagem de usuários é necessária para administração e para validar o escopo de gerenciamento de contas.

**Independent Test**: Autenticar como admin, chamar `GET /users`, e verificar que a resposta contém uma lista de usuários sem campos sensíveis.

**Acceptance Scenarios**:

1. **Given** um usuário admin autenticado, **When** ele chama `GET /users`, **Then** recebe a lista de todos os usuários.
2. **Given** um usuário não admin autenticado, **When** ele chama `GET /users`, **Then** recebe um `403 Forbidden`.

---

### User Story 3 - User updates own profile (Priority: P3)

Um usuário autenticado deve poder atualizar seus próprios dados básicos, com validação de autorização.

**Why this priority**: Atualização de perfil é um passo natural para gerenciamento de usuário e prepara o módulo para um CRUD completo.

**Independent Test**: Autenticar um usuário, chamar `PUT /users/:id` com o próprio `id` e dados de atualização válidos, e verificar que o perfil é atualizado e retornado sem campos sensíveis.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado, **When** ele chama `PUT /users/:id` com o próprio `id` e dados válidos, **Then** a atualização é permitida e retorna o perfil atualizado.
2. **Given** um usuário não admin tenta atualizar outro usuário, **When** ele chama `PUT /users/:id` para um `id` diferente do seu, **Then** recebe um `403 Forbidden`.

---

### User Story 4 - User or admin deletes account (Priority: P4)

Um usuário deve poder excluir sua própria conta, e um admin deve poder excluir qualquer conta, se autorizado.

**Why this priority**: Exclusão de usuários é útil para auto-serviço e administração, mas deve ser aplicada com regras claras de autorização.

**Independent Test**: Autenticar um usuário, chamar `DELETE /users/:id` com o próprio `id` e verificar que a conta é removida; também verificar que um admin pode excluir outra conta.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado, **When** ele chama `DELETE /users/:id` com o próprio `id`, **Then** a conta é removida.
2. **Given** um usuário autenticado não admin tenta deletar outro usuário, **When** ele chama `DELETE /users/:id`, **Then** recebe um `403 Forbidden`.

---

### Edge Cases

- O usuário autenticado tenta acessar `GET /users/:id` para outro usuário e não é admin.
- O usuário solicita `PUT /users/:id` com campos proibidos como senha ou role.
- Um `DELETE /users/:id` é chamado para um usuário já removido.
- Lista de usuários vazia deve retornar uma lista vazia, não um erro.
- Autenticação JWT inválida ou expirada deve resultar em `401 Unauthorized`.

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: O sistema MUST proteger todos os endpoints de gerenciamento de usuários com `authMiddleware` e JWT.
- **FR-002**: O sistema MUST adicionar `UserRepository.findAll()` para retornar todos os usuários.
- **FR-003**: O sistema MUST adicionar `UserRepository.findById(id)` para buscar um usuário específico.
- **FR-004**: O sistema SHOULD adicionar `UserRepository.update(id, data)` para atualização de perfil.
- **FR-005**: O sistema SHOULD adicionar `UserRepository.delete(id)` para remoção de usuário.
- **FR-006**: `ListUsersService` MUST usar `UserRepository.findAll()` para listar usuários e excluir campos sensíveis antes do retorno.
- **FR-007**: `GetUserByIdService` MUST retornar os dados do usuário solicitado ou `404` quando não existir.
- **FR-008**: `UpdateUserService` MUST permitir atualização somente quando o usuário estiver autorizado (próprio usuário ou admin).
- **FR-009**: `DeleteUserService` MUST permitir exclusão somente quando o usuário estiver autorizado (próprio usuário ou admin).
- **FR-010**: `UserController.list` MUST chamar `ListUsersService`, `UserController.show` MUST chamar `GetUserByIdService`, `UserController.update` MUST chamar `UpdateUserService`, e `UserController.delete` MUST chamar `DeleteUserService`.
- **FR-011**: O sistema MUST nunca expor `password` ou outros campos sensíveis em respostas de API.
- **FR-012**: Se `GET /users` for acessado por um usuário não admin, o sistema MUST retornar `403 Forbidden`.
- **FR-013**: A rota `GET /users/:id` MUST permitir que o usuário consulte seu próprio perfil e que o admin consulte qualquer perfil.

### Key Entities

- **User**: representa uma conta de usuário com atributos como `id`, `name`, `email`, `role`, `created_at` e outros campos de perfil necessários.
- **Authenticated User Context**: dados do usuário extraídos do JWT (`id`, `role`, `email`) usados para autorizar operações de leitura, atualização e exclusão.
- **UserRepository**: camada de persistência responsável por `findAll()`, `findById(id)`, `update(id, data)` e `delete(id)`.

## Success Criteria (mandatory)

### Measurable Outcomes

- **SC-001**: Usuários autenticados conseguem obter seu próprio perfil com `GET /users/:id` e recebem apenas campos não sensíveis.
- **SC-002**: Usuários admin autenticados conseguem obter a lista completa de usuários com `GET /users`.
- **SC-003**: Usuários não admin recebem `403 Forbidden` ao acessar `GET /users` ou tentar atualizar/excluir outro usuário.
- **SC-004**: Todas as respostas de usuário retornam sem o campo `password` ou dados sensíveis.
- **SC-005**: Operações de gerenciamento de usuários são protegidas por JWT e falham com `401 Unauthorized` quando não autenticadas.

## Assumptions

- O sistema já possui autenticação JWT funcional e `authMiddleware` disponível para proteger rotas.
- O usuário autenticado pode ser identificado por `id` e `role` extraídos do token.
- A implementação inicial prioriza o perfil autenticado e a listagem/admin; `update` e `delete` são benefícios de evolução que dependem de regras de autorização claras.
- O endpoint `GET /users` retorna todos os usuários apenas para admins; usuários comuns consultam seu próprio perfil por `GET /users/:id`.
- Uma rota dedicada `GET /users/me` é uma melhoria futura para conveniência, mas o presente escopo foca nos endpoints listados.

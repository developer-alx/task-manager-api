# Task Manager API

API REST para gerenciamento de tarefas desenvolvida com Node.js, TypeScript, Express e PostgreSQL.

## Status

🚧 Em desenvolvimento ativo

## Funcionalidades implementadas

- Autenticação com JWT
- CRUD de usuários
- CRUD de tarefas
- Controle de acesso (RBAC)
- PostgreSQL
- Migrations
- Docker Compose
- Swagger
- Arquitetura em camadas

## Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Docker
- JWT
- Zod
- Winston

---

# Task Manager API — Architecture Blueprint

## 1. Visão Geral do Projeto

Este projeto consiste em uma **API profissional de gerenciamento de tarefas**, construída com foco em:

* arquitetura escalável
* separação clara de responsabilidades
* versionamento do banco de dados
* facilidade de manutenção
* integração futura com agentes de IA

A aplicação seguirá princípios comuns em sistemas backend modernos, permitindo expansão futura para:

* autenticação
* multiusuários
* projetos e tarefas
* automações inteligentes
* integrações externas

---

# 2. Stack Tecnológica

### Backend

* Node.js
* TypeScript
* Express

### Banco de Dados

* PostgreSQL

### Gerenciamento de Schema

* node-pg-migrate

### Variáveis de Ambiente

* dotenv

### Ferramentas de Desenvolvimento

* ts-node-dev

---

# 3. Arquitetura de Software

A API seguirá a arquitetura em camadas amplamente utilizada em sistemas backend profissionais.

```
HTTP Request
     ↓
Routes
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Database (PostgreSQL)
```

## Responsabilidades de cada camada

### Routes

Define os endpoints da aplicação e direciona as requisições para os controllers.

### Controller

Responsável por:

* receber requisições HTTP
* validar dados básicos
* retornar respostas HTTP

### Service

Contém as **regras de negócio** da aplicação.

Exemplos:

* validação de duplicidade de usuário
* regras de criação de tarefas
* regras de status

### Repository

Responsável exclusivamente por **acesso ao banco de dados**.

Funções típicas:

* inserir registros
* buscar dados
* atualizar informações

### Database

Camada responsável pela conexão com o PostgreSQL.

---

# 4. Estrutura de Pastas do Projeto

```
task-manager-api
│
├─ src
│
│  ├─ controllers
│  │   └─ UserController.ts
│
│  ├─ services
│  │   └─ CreateUserService.ts
│
│  ├─ repositories
│  │   └─ UserRepository.ts
│
│  ├─ routes
│  │   └─ userRoutes.ts
│
│  ├─ database
│  │   └─ index.ts
│
│  └─ server.ts
│
├─ migrations
│
├─ .env
├─ package.json
└─ README.md
```

---

# 5. Modelo de Domínio (Domain Model)

## Entidades principais

### Users

Representa usuários do sistema.

Campos:

```
id
name
email
password
created_at
```

---

### Projects

Permite organizar tarefas por projetos.

Campos previstos:

```
id
name
description
user_id
created_at
```

---

### Tasks

Representa tarefas dentro de projetos.

Campos previstos:

```
id
title
description
status
project_id
assigned_to
created_at
updated_at
```

---

### Task Comments

Campos previstos:

```
id
task_id
user_id
content
created_at
```

---

### Task Status History

Permite rastrear mudanças de status.

Campos previstos:

```
id
task_id
old_status
new_status
changed_at
```

---

# 6. Versionamento do Banco (Migrations)

O projeto utiliza **node-pg-migrate** para versionar alterações no banco.

Vantagens:

* histórico de mudanças
* replicação do banco em qualquer ambiente
* deploy seguro

Estrutura:

```
migrations/
   1713300000000_init-tables.js
```

Cada migration contém:

```
exports.up
exports.down
```

* **up** → aplica mudanças
* **down** → reverte mudanças

---

# 7. Fluxo de Criação de Usuário

Fluxo completo da requisição:

```
POST /users
       ↓
UserController
       ↓
CreateUserService
       ↓
UserRepository
       ↓
INSERT INTO users
```

---

# 8. Fluxo de Desenvolvimento de Features

Processo recomendado:

```
1 Criar migration
2 Atualizar banco
3 Criar repository
4 Criar service
5 Criar controller
6 Criar rota
7 Testar endpoint
```

---

# 9. Princípios de Engenharia Aplicados

Este projeto segue princípios importantes:

### Single Responsibility

Cada camada possui apenas uma responsabilidade.

### Separation of Concerns

Separação clara entre:

* regras de negócio
* infraestrutura
* acesso a dados

### Clean Architecture

Permite:

* manutenção simples
* testes unitários
* expansão futura

---

# 10. Expansão Futura com IA

O projeto foi planejado para permitir integração futura com **agentes inteligentes**.

Possíveis módulos:

### AI Task Assistant

Sugestão automática de tarefas baseada em contexto do projeto.

### Task Prioritization Engine

Algoritmo que reorganiza tarefas com base em:

* prazos
* urgência
* histórico de execução

### AI Planning Agent

Agente capaz de:

* quebrar objetivos em subtarefas
* sugerir prazos
* gerar planos de execução

### Natural Language Task Creation

Permitir criação de tarefas via linguagem natural.

Exemplo:

```
"criar tarefa para revisar documentação amanhã"
```

---

# 11. Escalabilidade Arquitetural

Estrutura preparada para evolução para:

```
Microservices
Event-driven architecture
Message queues
AI services
```

---

# 12. Roadmap Técnico do Projeto

Fases previstas:

### Fase 1 — Base da API

* conexão PostgreSQL
* migrations
* criação de usuários

### Fase 2 — Gerenciamento de tarefas

* projects
* tasks
* comentários

### Fase 3 — Autenticação

* JWT
* controle de acesso

### Fase 4 — Otimização

* caching
* logs estruturados
* observabilidade

### Fase 5 — Integração com IA

* agentes automatizados
* automações inteligentes

---

# 13. Objetivo Educacional

Este projeto também funciona como laboratório para aprendizado de:

* arquitetura backend
* modelagem de banco
* design de APIs
* boas práticas de engenharia de software
* integração de sistemas inteligentes

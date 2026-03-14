<h3 align="center">
  Desafio Backend
</h3>

<p align="center">
   <a href="https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml">
      <img src="https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml/badge.svg?branch=main" alt="Frontend CI">
   </a>
   <a href="https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml">
      <img src="https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml/badge.svg?branch=main" alt="ms-order CI">
   </a>
   <a href="https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml">
      <img src="https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml/badge.svg?branch=main" alt="ms-customer CI">
   </a>
   <a href="https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml">
      <img src="https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml/badge.svg?branch=main" alt="api-gateway CI">
   </a>
   <a href="https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml">
      <img src="https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml/badge.svg?branch=main" alt="service-discovery CI">
   </a>
</p>

<p align="center">
   <img src="https://img.shields.io/badge/frontend%20coverage-79.1%25-brightgreen" alt="Frontend Coverage">
   <img src="https://img.shields.io/badge/frontend%20coverage%20gate-passing-brightgreen" alt="Frontend Coverage Gate">
   <img src="https://img.shields.io/badge/backend%20coverage-JaCoCo%20artifacts-blue" alt="Backend Coverage Reports">
</p>

<p align="center">
   Build e testes usam badges dinâmicos do GitHub Actions. Os badges de cobertura refletem o estado atual validado do repositório: frontend com gate aprovado e backend com relatórios JaCoCo publicados como artefatos no CI.
</p>

* Java 21
* Spring Boot 3
* Spring Web
* Spring Data MongoDB
* Spring Cloud
* DB: MongoDB
* Messaging: RabbitMQ (AMQP)
* Container: Docker
* CI/CD: Github Actions
* Unit tests: JUnit + Mockito
* Integration tests: Testcontainers / MockRabbit + in-memory MongoDB
* API tests: openapi4j 


# Status de Build, Testes e Cobertura

## Status atual do repositório

| Área | Build | Testes | Cobertura |
| --- | --- | --- | --- |
| Frontend | Pipeline dedicada em `.github/workflows/workflow-frontend.yml` | Suíte validada com execução por camadas e suíte completa | Gate ativo com thresholds globais e por domínio |
| ms-order | Pipeline dedicada em `.github/workflows/workflow-backend-orders.yml` | Testes unitários, integração e E2E opt-in no CI | Relatório JaCoCo gerado e publicado como artefato |
| ms-customer | Pipeline dedicada em `.github/workflows/workflow-backend-customers.yml` | Testes unitários, integração e E2E opt-in no CI | Relatório JaCoCo gerado e publicado como artefato |
| api-gateway | Pipeline dedicada em `.github/workflows/workflow-backend-gateway.yml` | Testes executados no build Maven | Relatório JaCoCo gerado e publicado como artefato |
| service-discovery | Pipeline dedicada em `.github/workflows/workflow-backend-discovery.yml` | Testes executados no build Maven | Relatório JaCoCo gerado e publicado como artefato |

## Frontend

- Workflow: `.github/workflows/workflow-frontend.yml`
- Etapas do CI:
   - lint
   - testes de services
   - testes de components
   - suíte completa com gate de cobertura
- Status validado localmente:
   - `115/115` testes passando na suíte completa
   - cobertura global validada pelo CI local em `npm --prefix frontend run test:ci:threshold`
- Thresholds globais ativos:
   - statements: `70%`
   - branches: `70%`
   - functions: `60%`
   - lines: `75%`
- Thresholds por domínio:
   - `src/app/core`: statements `82%`, branches `78%`, functions `69%`, lines `82%`
   - `src/app/services`: statements `69%`, branches `76%`, functions `66%`, lines `69%`
   - `src/app/customers`: statements `76%`, branches `65%`, functions `66%`, lines `78%`
   - `src/app/orders`: statements `71%`, branches `63%`, functions `61%`, lines `71%`

## Backend

- Módulos com pipeline própria:
   - `ms-order`
   - `ms-customer`
   - `api-gateway`
   - `service-discovery`
- Cada pipeline executa:
   - checagens de qualidade estática
   - build Maven
   - testes do módulo
   - geração de relatório JaCoCo
- Status de cobertura no backend:
   - os relatórios são publicados como artefatos do GitHub Actions
   - ainda não existe gate mínimo de cobertura no backend, apenas geração e publicação dos relatórios

## Comandos de verificação local

### Frontend

```bash
npm --prefix frontend run lint
npm --prefix frontend run test:services:ci
npm --prefix frontend run test:components:ci
npm --prefix frontend run test:ci:threshold
```

### Backend

```bash
mvn -B -f ms-order/pom.xml clean package
mvn -B -f ms-customer/pom.xml clean package
mvn -B -f api-gateway/pom.xml clean package
mvn -B -f service-discovery/pom.xml clean package
```


1. Environment setup
1. Data modeling
1. Message-consumer microservice
1. Service & repository layers
1. REST API with OpenAPI documentation
1. Integration tests (Testcontainers / MockRabbit + in-memory MongoDB)
1. Unit tests (JUnit + Mockito)
1. API contract tests (openapi4j)


# Plano de Trabalho - Desenvolvimento da Aplicação



# 1. Fase de Planejamento e Arquitetura
## 1.1 Definição de arquitetura

Serão definidos os principais blocos do sistema.

Arquitetura sugerida

Frontend
   |
API Gateway (Spring Cloud)
   |
Backend Services
   |-- Service A
   |-- Service B
   |
Messaging (RabbitMQ)
   |
MongoDB

Tecnologias principais:

* Backend: Spring Boot + Spring Web
* Persistência: Spring Data MongoDB + MongoDB
* Integração assíncrona: RabbitMQ
* Infraestrutura: Docker
* CI/CD: GitHub Actions

Definir também:

* contratos de API
* eventos de mensageria
* estrutura de módulos
* estratégia de versionamento

## 1.1 Context Diagram (C4 - Level 1)

Mostra o sistema e os atores externos.

[Diagrama](docs/architecture/context-diagram.puml)

## 1.2 Container Diagram (C4 - Level 2)

Mostra os containers do sistema (apps, APIs, bancos, etc)

[Diagrama](docs/architecture/container-diagram.puml)

## 1.3 Component Diagram (C4 - Level 3)

Mostra os componentes internos de um serviço Spring Boot.

[Diagrama](docs/architecture/component-diagram-backend.puml)

# 2. Setup do Projeto (Foundation)

Essa fase cria toda a base de engenharia antes da primeira feature.

## 2.1 Estrutura de repositório

Exemplo:

project-root
│
├── backend
│   ├── api-gateway
│   ├── service-users
│   ├── service-orders
│
├── frontend
│
├── infrastructure
│   ├── docker
│   ├── rabbitmq
│   ├── mongodb
│
└── docs

## 2.2 Setup de containers

Criar ambiente local com:

* Docker
* MongoDB
* RabbitMQ

## 2.3 Pipeline CI/CD

Criar pipeline inicial no GitHub Actions.

Pipeline básico:

1. build
1. testes unitários
1. testes de integração
1. build docker
1. push registry
1. deploy ECS, GCP ou azure

# 3. Estratégia de Desenvolvimento

Utilize vertical slices (feature por feature).

Cada feature inclui:

1. Model
1. Repository
1. Service
1. Controller
1. Testes
1. API docs
1. Frontend

# 4. Padrão de Backend

Estrutura do serviço:

controller
service
repository
domain
dto
config
messaging

exemplo:

user
 ├── controller
 ├── service
 ├── repository
 ├── domain
 └── dto
 
# 5. Estratégia de Testes

Esse stack já define muito bem os níveis.

## 5.1 Testes Unitários

Ferramentas:

* JUnit
* Mockito

Testar:

* services
* regras de negócio
* mapeamentos

5.2 Testes de Integração

Ferramentas:

* Testcontainers
* MongoDB container
* RabbitMQ container

Exemplo:

@SpringBootTest
@Testcontainers
class OrderServiceIT

Subir:

* Mongo
* RabbitMQ

## 5.3 Testes de API

Ferramenta:

* openapi4j

Objetivo:

* validar contrato OpenAPI
* garantir que API implementa spec

# 6. Mensageria (RabbitMQ)

Definir eventos desde o início.

Exemplo:

order.created
order.paid
order.cancelled

Fluxo:

Service A -> publish event -> RabbitMQ -> Service B

Boas práticas:

* eventos imutáveis
* versionamento
* idempotência

# 7. Estratégia de Frontend

Fluxo de trabalho:

* API contract first (OpenAPI)
* mock API
* desenvolvimento frontend
* integração backend

Ferramentas úteis:

* geração de client via OpenAPI
* mocks

# 8. Estratégia de Releases

Sugestão:

ambientes

* local
* dev
* staging
* prod

Deploy:

GitHub Actions
      ↓
Build Docker
      ↓
Registry
      ↓
Deploy

# 9. Roadmap de Desenvolvimento

Exemplo de roadmap:

Sprint 1

* arquitetura
* docker
* CI/CD
* setup backend
* setup frontend

Sprint 2

* autenticação
* primeiro CRUD
* eventos iniciais

Sprint 3

* mensageria
* integração entre serviços
* testes de integração

Sprint 4

* observabilidade
* métricas
* hardening

# 10. Checklist de Qualidade

Antes de cada merge:

✔ testes unitários
✔ testes de integração
✔ contrato OpenAPI válido
✔ build docker
✔ pipeline verde
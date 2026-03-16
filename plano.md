# Plano de Trabalho - Desenvolvimento da Aplicação

1. Environment setup
1. Data modeling
1. Message-consumer microservice
1. Service & repository layers
1. REST API with OpenAPI documentation
1. Integration tests (Testcontainers / MockRabbit + in-memory MongoDB)
1. Unit tests (JUnit + Mockito)
1. API contract tests ()

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

* 

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
# desafioBTG

[Português](readme.md) | [English](README.en.md)

Plataforma full stack para processamento de pedidos e consulta de relatórios, com frontend Angular, serviços Spring Boot, RabbitMQ, MySQL e Docker Compose.

## Resumo Executivo

Este repositório implementa o desafio BTG com foco em ingestão assíncrona de pedidos, persistência dos dados e exposição de consultas para relatórios operacionais por cliente e por pedido.

Objetivos do projeto:

- consumir pedidos enviados para uma fila RabbitMQ
- persistir dados e agregados em MySQL
- expor APIs REST para consulta dos relatórios solicitados
- integrar backend e frontend com qualidade contínua por testes e pipeline

Escopo principal:

- `frontend`: interface Angular para consulta dos dados
- `ms-customer`: domínio relacionado ao cliente e consultas associadas
- `ms-order`: consumo de pedidos, persistência e consultas de relatório
- `docs`: arquitetura, ADRs e material de apoio

Arquitetura resumida:

Frontend
	|
APIs REST
	|
`ms-customer` + `ms-order`
	|
RabbitMQ + MySQL

## Stack

- Java 17
- Spring Boot
- Angular 21
- MySQL 8
- RabbitMQ
- Docker Compose
- GitHub Actions + Codecov

## Status do Projeto

- backend organizado em `ms-customer` e `ms-order`
- frontend Angular versionado no mesmo repositório
- documentação arquitetural e ADRs em `docs`
- roadmap detalhado em [plano.md](plano.md)

## Build, Testes e Cobertura

| Tipo | Status |
| --- | --- |
| Build | [![Build frontend](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Build ms-order](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Build ms-customer](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) |
| Testes | [![Testes frontend](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-frontend.yml?branch=main&label=testes-frontend)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Testes ms-order](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-orders.yml?branch=main&label=testes-ms-order)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Testes ms-customer](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-customers.yml?branch=main&label=testes-ms-customer)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) |
| Cobertura | [![Codecov ms-order](https://codecov.io/gh/leoalmeida/desafioBTG/branch/main/graph/badge.svg?flag=ms-order)](https://codecov.io/gh/leoalmeida/desafioBTG) [![JaCoCo](https://img.shields.io/badge/cobertura-JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow.yml) [![Codecov ms-customer](https://codecov.io/gh/leoalmeida/desafioBTG/branch/main/graph/badge.svg?flag=ms-customer)](https://codecov.io/gh/leoalmeida/desafioBTG) [![JaCoCo](https://img.shields.io/badge/cobertura-JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow.yml) [![Codecov frontend](https://codecov.io/gh/leoalmeida/desafioBTG/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/leoalmeida/desafioBTG) [![JaCoCo](https://img.shields.io/badge/cobertura-JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow.yml)|

Relatorios de cobertura backend sao gerados com JaCoCo e publicados como artefatos nos jobs de teste.

## Sumario

- [Resumo Executivo](#resumo-executivo)
- [Stack](#stack)
- [Status do Projeto](#status-do-projeto)
- [Build, Testes e Cobertura](#build-testes-e-cobertura)
- [Modulos do Repositorio](#modulos-do-repositorio)
- [Portas e Integracoes](#portas-e-integracoes)
- [Requisitos](#requisitos)
- [Como Rodar Rapido](#como-rodar-rapido)
- [Configuracao](#configuracao)
- [Testes](#testes)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)
- [Referencias](#referencias)

## Modulos do Repositorio

Modulos no repositorio raiz:

- `frontend`
- `ms-customer`
- `ms-order`
- `docs`
- `pom.xml` raiz para build agregado de backend

## Portas e Integracoes

- frontend: geralmente `http://localhost:4200` quando executado via Angular CLI
- `ms-customer` e `ms-order`: `server.port=0` quando executados localmente fora do Docker
- MySQL: `3306` no container, com mapeamento via variavel `MYSQL_LOCAL_PORT`
- RabbitMQ: `5672` e painel de gerenciamento em `15672`

## Requisitos

- JDK 17
- Maven 3.9+
- Node.js 20+ e npm
- Docker (opcional para ambiente completo)

## Como Rodar Rapido

### Subida local essencial

1. executar o build backend na raiz
2. instalar dependencias do frontend
3. subir MySQL e RabbitMQ via Docker Compose ou usar ambiente equivalente
4. iniciar `ms-customer` e `ms-order`
5. iniciar o frontend e validar as consultas

### 1. Build backend

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG"
mvn clean install
```

### 2. Frontend

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG\frontend"
npm install
npm start
```

### 3. Subir servicos backend

1. ms-customer
2. ms-order

Exemplo:

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG\ms-customer"
mvn spring-boot:run
```

Repita para `ms-order` em outro terminal.

### Resultado esperado

- frontend disponivel localmente
- servicos backend conectados a MySQL e RabbitMQ
- consultas de relatorio acessiveis conforme os contratos do projeto

## Configuracao

O projeto utiliza variaveis via .env para Docker Compose e import opcional em modulos de dominio.

Variaveis comuns:

- MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD
- SPRING_*_LOCAL_PORT, SPRING_*_DOCKER_PORT

## Testes

### Frontend

```powershell
npm --prefix frontend run lint
npm --prefix frontend run test:services:ci
npm --prefix frontend run test:components:ci
npm --prefix frontend run test:ci:threshold
```

### Backend

```powershell
mvn -B -f ms-order/pom.xml clean package
mvn -B -f ms-customer/pom.xml clean package
```

## Docker

Existe docker-compose.yaml na raiz para subir frontend, ms-customer, ms-order, MySQL e RabbitMQ.

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG"
docker compose up --build
```

## Troubleshooting

- Erro de conexao com banco: valide variaveis MYSQL_* e SPRING_APPLICATION_JSON no compose.
- Erro no consumo de pedidos: valide se RabbitMQ esta ativo e se as configuracoes de fila estao corretas.
- Frontend sem acesso a API: valide variaveis de ambiente, proxy e se os servicos backend estao ativos.

## Referencias

- roadmap e planejamento: [plano.md](plano.md)
- backlog executivo do portfólio: [../votacao-backend/docs/portfolio/backlog-executivo.md](../votacao-backend/docs/portfolio/backlog-executivo.md)
- matriz comparativa dos desafios: [../votacao-backend/docs/portfolio/matriz-comparativa.md](../votacao-backend/docs/portfolio/matriz-comparativa.md)
- ADR de arquitetura orientada a eventos: [docs/adr/ADR-001-event-driven-architecture.md](docs/adr/ADR-001-event-driven-architecture.md)
- diagramas: [docs/architecture](docs/architecture)
- enunciado do desafio: [problem.md](problem.md)

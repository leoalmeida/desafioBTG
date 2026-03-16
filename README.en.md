# desafioBTG

[Português](readme.md) | [English](README.en.md)

Full stack platform for order processing and reporting, built with Angular, Spring Boot services, RabbitMQ, MySQL, and Docker Compose.

## Executive Summary

This repository implements the BTG challenge with focus on asynchronous order ingestion, persistent storage, and REST APIs for operational reports by customer and by order.

Project goals:

- consume orders sent to RabbitMQ
- persist data and aggregates in MySQL
- expose REST APIs for the requested reporting queries
- integrate backend and frontend with continuous quality through tests and CI

Main scope:

- `frontend`: Angular UI for report queries
- `ms-customer`: customer-related domain and queries
- `ms-order`: order consumption, persistence, and reporting queries
- `docs`: architecture, ADRs, and support material

Architecture at a glance:

Frontend
	|
REST APIs
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

## Project Status

- backend organized around `ms-customer` and `ms-order`
- Angular frontend versioned in the same repository
- architecture documentation and ADRs available under `docs`
- detailed roadmap available in [plano.md](plano.md)

## Build, Tests and Coverage

| Type | Status |
| --- | --- |
| Build | [![Build frontend](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Build ms-order](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Build ms-customer](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) [![Build api-gateway](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml) [![Build service-discovery](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml) |
| Tests | [![Tests frontend](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-frontend.yml?branch=main&label=tests-frontend)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Tests ms-order](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-orders.yml?branch=main&label=tests-ms-order)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Tests ms-customer](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-customers.yml?branch=main&label=tests-ms-customer)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) [![Tests api-gateway](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-gateway.yml?branch=main&label=tests-api-gateway)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml) [![Tests service-discovery](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-discovery.yml?branch=main&label=tests-service-discovery)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml) |
| Coverage | [![Coverage frontend](https://img.shields.io/badge/coverage-frontend%20gate-brightgreen)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Coverage ms-order](https://img.shields.io/badge/coverage-ms--order%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Coverage ms-customer](https://img.shields.io/badge/coverage-ms--customer%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) [![Coverage api-gateway](https://img.shields.io/badge/coverage-api--gateway%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml) [![Coverage service-discovery](https://img.shields.io/badge/coverage-service--discovery%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml) |

Backend coverage reports are generated with JaCoCo and published as artifacts in test jobs.

## Table of Contents

- [Executive Summary](#executive-summary)
- [Stack](#stack)
- [Project Status](#project-status)
- [Build, Tests and Coverage](#build-tests-and-coverage)
- [Repository Modules](#repository-modules)
- [Ports and Integrations](#ports-and-integrations)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Tests](#tests)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)
- [References](#references)

## Repository Modules

Modules at the repository root:

- `frontend`
- `ms-customer`
- `ms-order`
- `docs`
- root `pom.xml` for aggregated backend build

## Ports and Integrations

- frontend: usually `http://localhost:4200` when started with Angular CLI
- `ms-customer` and `ms-order`: `server.port=0` when run locally outside Docker
- MySQL: `3306` in the container, mapped through `MYSQL_LOCAL_PORT`
- RabbitMQ: `5672` and management UI on `15672`

## Requirements

- JDK 17
- Maven 3.9+ (or mvnw)
- Node.js 20+ and npm
- Docker (optional for full environment)

## Quick Start

### Essential local startup

1. run the backend build at the repository root
2. install frontend dependencies
3. start MySQL and RabbitMQ with Docker Compose or use an equivalent environment
4. start `ms-customer` and `ms-order`
5. start the frontend and validate the report queries

### 1. Backend build

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

### 3. Start backend services

1. ms-customer
2. ms-order

Example:

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG\ms-customer"
mvn spring-boot:run
```

Repeat for `ms-order` in another terminal.

### Expected result

- frontend available locally
- backend services connected to MySQL and RabbitMQ
- reporting queries accessible according to the project contracts

## Configuration

The project uses .env variables for Docker Compose and optional import in domain modules.

Common variables:

- MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD
- SPRING_*_LOCAL_PORT, SPRING_*_DOCKER_PORT

## Tests

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

A root docker-compose.yaml is available to run frontend, ms-customer, ms-order, MySQL and RabbitMQ.

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG"
docker compose up --build
```

## Troubleshooting

- Database connection errors: validate MYSQL_* variables and SPRING_APPLICATION_JSON in compose.
- Order consumption issues: validate that RabbitMQ is up and queue settings are correct.
- Frontend cannot reach the API: validate environment variables, proxy settings, and backend service availability.

## References

- roadmap and planning: [plano.md](plano.md)
- event-driven architecture ADR: [docs/adr/ADR-001-event-driven-architecture.md](docs/adr/ADR-001-event-driven-architecture.md)
- architecture diagrams: [docs/architecture](docs/architecture)
- challenge statement: [problem.md](problem.md)

# desafioBTG

[Português](README.md) | [English](README.en.md)

## Build, Tests and Coverage

| Type | Status |
| --- | --- |
| Build | [![Build frontend](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Build ms-order](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Build ms-customer](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) [![Build api-gateway](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml) [![Build service-discovery](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml) |
| Tests | [![Tests frontend](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-frontend.yml?branch=main&label=tests-frontend)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Tests ms-order](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-orders.yml?branch=main&label=tests-ms-order)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Tests ms-customer](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-customers.yml?branch=main&label=tests-ms-customer)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) [![Tests api-gateway](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-gateway.yml?branch=main&label=tests-api-gateway)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml) [![Tests service-discovery](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-discovery.yml?branch=main&label=tests-service-discovery)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml) |
| Coverage | [![Coverage frontend](https://img.shields.io/badge/coverage-frontend%20gate-brightgreen)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Coverage ms-order](https://img.shields.io/badge/coverage-ms--order%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Coverage ms-customer](https://img.shields.io/badge/coverage-ms--customer%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) [![Coverage api-gateway](https://img.shields.io/badge/coverage-api--gateway%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml) [![Coverage service-discovery](https://img.shields.io/badge/coverage-service--discovery%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml) |

Backend coverage reports are generated with JaCoCo and published as artifacts in test jobs.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F)
![Angular](https://img.shields.io/badge/Angular-21-red)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-AMQP-FF6600)

Full stack platform based on microservices with Angular frontend, API Gateway, Service Discovery, ms-customer and ms-order.

## Table of Contents

- [Overview](#overview)
- [Build, Tests and Coverage](#build-tests-and-coverage)
- [Ports and Discovery](#ports-and-discovery)
- [Requirements](#requirements)
- [How to Run](#how-to-run)
- [Configuration](#configuration)
- [Tests](#tests)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)

## Overview

- Java 17
- Spring Boot / Spring Cloud
- Angular 21
- MySQL 8
- RabbitMQ
- Maven multi-module

Modules in the root aggregator:

- frontend
- api-gateway
- service-discovery
- ms-customer
- ms-order

## Ports and Discovery

- frontend: http://localhost:4200
- api-gateway: http://localhost:8082
- service-discovery: http://localhost:8761
- ms-customer and ms-order: server.port=0 (dynamic ports, registered in Eureka)

## Requirements

- JDK 17
- Maven 3.9+ (or mvnw)
- Node.js 20+ and npm
- Docker (optional for full environment)

## How to Run

### 1. Backend build

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG"
.\mvnw.cmd clean install
```

### 2. Frontend

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG\frontend"
npm install
npm start
```

### 3. Start backend services (recommended order)

1. service-discovery
2. api-gateway
3. ms-customer
4. ms-order

Example:

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG\service-discovery"
..\mvnw.cmd spring-boot:run
```

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
mvn -B -f api-gateway/pom.xml clean package
mvn -B -f service-discovery/pom.xml clean package
```

## Docker

A root docker-compose.yaml is available to run frontend, ms-customer, ms-order, MySQL and RabbitMQ.

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG"
docker compose up --build
```

## Troubleshooting

- Services do not show in Eureka: make sure service-discovery started first.
- Database connection errors: validate MYSQL_* variables and SPRING_APPLICATION_JSON in compose.
- Frontend cannot reach API: ensure gateway is up on 8082.

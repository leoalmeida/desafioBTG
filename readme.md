# desafioBTG

[Português](README.md) | [English](README.en.md)

## Build, Testes e Cobertura

| Tipo | Status |
| --- | --- |
| Build | [![Build frontend](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Build ms-order](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Build ms-customer](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) [![Build api-gateway](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml) [![Build service-discovery](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml/badge.svg?branch=main)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml) |
| Testes | [![Testes frontend](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-frontend.yml?branch=main&label=testes-frontend)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Testes ms-order](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-orders.yml?branch=main&label=testes-ms-order)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Testes ms-customer](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-customers.yml?branch=main&label=testes-ms-customer)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) [![Testes api-gateway](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-gateway.yml?branch=main&label=testes-api-gateway)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml) [![Testes service-discovery](https://img.shields.io/github/actions/workflow/status/leoalmeida/desafioBTG/workflow-backend-discovery.yml?branch=main&label=testes-service-discovery)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml) |
| Cobertura | [![Cobertura frontend](https://img.shields.io/badge/cobertura-frontend%20gate-brightgreen)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-frontend.yml) [![Cobertura ms-order](https://img.shields.io/badge/cobertura-ms--order%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-orders.yml) [![Cobertura ms-customer](https://img.shields.io/badge/cobertura-ms--customer%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-customers.yml) [![Cobertura api-gateway](https://img.shields.io/badge/cobertura-api--gateway%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-gateway.yml) [![Cobertura service-discovery](https://img.shields.io/badge/cobertura-service--discovery%20JaCoCo-blue)](https://github.com/leoalmeida/desafioBTG/actions/workflows/workflow-backend-discovery.yml) |

Relatorios de cobertura backend sao gerados com JaCoCo e publicados como artefatos nos jobs de teste.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F)
![Angular](https://img.shields.io/badge/Angular-21-red)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-AMQP-FF6600)

Plataforma full stack baseada em microsservicos com frontend Angular, API Gateway, Service Discovery, ms-customer e ms-order.

## Sumario

- [Visao Geral](#visao-geral)
- [Build, Testes e Cobertura](#build-testes-e-cobertura)
- [Portas e Discovery](#portas-e-discovery)
- [Requisitos](#requisitos)
- [Como Rodar](#como-rodar)
- [Configuracao](#configuracao)
- [Testes](#testes)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)

## Visao Geral

- Java 17
- Spring Boot / Spring Cloud
- Angular 21
- MySQL 8
- RabbitMQ
- Maven multi-modulo

Modulos no agregador raiz:

- frontend
- api-gateway
- service-discovery
- ms-customer
- ms-order

## Portas e Discovery

- frontend: http://localhost:4200
- api-gateway: http://localhost:8082
- service-discovery: http://localhost:8761
- ms-customer e ms-order: server.port=0 (porta dinamica, registrados no Eureka)

## Requisitos

- JDK 17
- Maven 3.9+ (ou mvnw)
- Node.js 20+ e npm
- Docker (opcional para ambiente completo)

## Como Rodar

### 1. Build backend

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

### 3. Subir servicos backend (ordem recomendada)

1. service-discovery
2. api-gateway
3. ms-customer
4. ms-order

Exemplo:

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG\service-discovery"
..\mvnw.cmd spring-boot:run
```

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
mvn -B -f api-gateway/pom.xml clean package
mvn -B -f service-discovery/pom.xml clean package
```

## Docker

Existe docker-compose.yaml na raiz para subir frontend, ms-customer, ms-order, MySQL e RabbitMQ.

```powershell
Set-Location "c:\Users\leo_a\projetos\desafioBTG"
docker compose up --build
```

## Troubleshooting

- Servicos nao aparecem no Eureka: confirme se service-discovery iniciou primeiro.
- Erro de conexao com banco: valide variaveis MYSQL_* e SPRING_APPLICATION_JSON no compose.
- Frontend sem acesso a API: valide se gateway esta ativo em 8082.

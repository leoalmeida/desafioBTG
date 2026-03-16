# Plano de Trabalho - desafioBTG

## 1. Objetivo

Entregar e evoluir a solução de processamento de pedidos e consulta de relatórios, garantindo:

- consumo confiável de pedidos via RabbitMQ
- persistência consistente dos dados em MySQL
- APIs REST para consulta de totais, quantidade de pedidos por cliente e lista de pedidos
- integração com frontend e qualidade contínua via testes e pipeline

## 2. Escopo Atual do Repositório

Módulos e diretórios principais:

- `frontend`
- `ms-customer`
- `ms-order`
- `docs`
- `.github/workflows`

Tecnologias base:

- Java 17
- Spring Boot
- Angular 21
- MySQL
- RabbitMQ
- Docker Compose
- GitHub Actions + Codecov

## 3. Arquitetura e Decisões

Fluxo macro:

Frontend
   |
APIs de consulta
   |
`ms-customer` e `ms-order`
   |
RabbitMQ + MySQL

Documentos de apoio:

- [ADR - Event Driven Architecture](docs/adr/ADR-001-event-driven-architecture.md)
- [Container Diagram](docs/architecture/container-diagram.puml)
- [Component Diagram](docs/architecture/component-diagram-backend.puml)

Decisões obrigatórias para novas features:

- contrato OpenAPI primeiro nas APIs expostas
- mensagens versionadas e consumidor idempotente
- persistência orientada aos relatórios solicitados pelo desafio
- frontend evoluindo sobre contratos estáveis

## 4. Estratégia de Desenvolvimento

Modelo de execução: vertical slices por capacidade de negócio.

Cada slice deve incluir:

1. modelagem de domínio
2. persistência (`repository`)
3. regra de negócio (`service`)
4. mensageria (`consumer` e contratos)
5. API (`controller` + DTOs + validações)
6. testes unitários
7. testes de integração
8. atualização frontend (quando aplicável)

Estrutura padrão dos serviços:

- `controller`
- `service`
- `repository`
- `domain`
- `dto`
- `config`
- `messaging`

## 5. Fases de Entrega

### Fase 1 - Foundation

Objetivo: estabilizar ambiente, contratos e build.

Entregáveis:

- Docker Compose funcional com frontend, serviços, MySQL e RabbitMQ
- variáveis de ambiente e convenções de configuração revisadas
- build e pipelines padronizados para backend e frontend
- documentação de execução local atualizada

Critérios de aceite:

- backend compila na raiz com `mvn clean install`
- frontend sobe localmente e integra com as APIs disponíveis

### Fase 2 - Domínio de Pedidos e Relatórios

Objetivo: consolidar os casos de uso centrais do desafio.

Entregáveis mínimos:

- consumidor RabbitMQ para ingestão de pedidos
- persistência dos pedidos e agregados necessários
- API para valor total do pedido
- API para quantidade de pedidos por cliente
- API para listagem de pedidos por cliente

Critérios de aceite:

- cálculo e consulta dos relatórios com testes automatizados
- payload de entrada consumido e persistido corretamente

### Fase 3 - Integração e Consistência

Objetivo: integrar backend e frontend com confiabilidade operacional.

Entregáveis:

- contratos de API estabilizados e documentados
- integração do frontend com consultas de relatório
- testes de integração com MySQL e RabbitMQ via containers
- idempotência, retry e tratamento de falhas nos consumidores

Critérios de aceite:

- mensagens duplicadas não geram inconsistência
- frontend consegue consumir os relatórios principais sem ajuste manual de contrato

### Fase 4 - Observabilidade e Release Readiness

Objetivo: elevar robustez para demonstração e ambientes superiores.

Entregáveis:

- logs estruturados e troubleshooting consolidado
- cobertura mínima acordada por módulo
- revisão de performance das consultas e payloads
- validação final de imagens Docker e pipeline

Critérios de aceite:

- execução local previsível para avaliadores
- documentação suficiente para build, teste e operação

## 6. Estratégia de Testes

### 6.1 Unitários

Ferramentas:

- JUnit 5
- Mockito
- framework de testes Angular já configurado no frontend

Cobertura mínima por slice:

- regras de negócio
- agregações e cálculos de relatório
- mapeamentos críticos

### 6.2 Integração

Ferramentas:

- Spring Boot Test
- Testcontainers (MySQL e RabbitMQ)

Escopo:

- consumo de mensagens e persistência
- integração repositório + banco
- integração entre camadas da API

### 6.3 Contrato de API

Ferramentas sugeridas:

- validação OpenAPI no pipeline
- testes de contrato com MockMvc ou Rest Assured

Objetivos:

- garantir aderência entre API e frontend
- prevenir regressões nas consultas de relatório

## 7. CI/CD e Releases

Pipeline mínimo por módulo:

1. build
2. testes unitários
3. testes de integração
4. cobertura e publicação de relatório
5. build de imagem Docker

Ambientes-alvo:

- local
- dev
- homologação
- prod

Política de merge:

- pipeline verde obrigatório
- cobertura mínima respeitada
- revisão de código aprovada

## 8. Roadmap Sugerido (4 Sprints)

Premissa de conversão para planejamento inicial:

- 2 pontos = 1 dia-pessoa
- a conversão serve para previsão macro, não para compromisso fechado

### Sprint 1

Estimativa: 20 a 28 pontos

Equivalente: 10 a 14 dias-pessoa

- foundation: revisar `docker-compose`, `.env`, build backend e frontend
- `ms-order`: revisar contratos de entrada, modelo de pedido e persistência base
- `ms-customer`: revisar responsabilidades atuais e contratos expostos
- frontend: revisar ambientes, proxy e integração base
- docs: consolidar arquitetura e guias de execução local

### Sprint 2

Estimativa: 24 a 32 pontos

Equivalente: 12 a 16 dias-pessoa

- `ms-order`: concluir consumo RabbitMQ e persistência dos pedidos
- `ms-order`: implementar APIs de total do pedido e listagem por cliente
- `ms-customer`: consolidar APIs e regras relacionadas ao cliente
- frontend: integrar consultas principais e estados de tela
- testes: cobrir regras principais com testes unitários e integração

### Sprint 3

Estimativa: 20 a 28 pontos

Equivalente: 10 a 14 dias-pessoa

- mensageria: implementar idempotência, retry e tratamento de falhas
- relatórios: concluir quantidade de pedidos por cliente e refinamentos de consulta
- frontend: ajustar experiência de consulta e feedback de erro
- testes: validar cenários com MySQL e RabbitMQ via Testcontainers
- docs: registrar contratos de eventos e fluxos de integração

### Sprint 4

Estimativa: 16 a 24 pontos

Equivalente: 8 a 12 dias-pessoa

- observabilidade: revisar logs, saúde e troubleshooting por módulo
- hardening: revisar performance, queries e configuração sensível
- release: validar imagens Docker, pipeline e prontidão para avaliação final
- docs: consolidar relatório técnico, operação e checklist de entrega

## 9. Backlog por Serviço

### `ms-order`

Historia `BTG-ORD-01`

- como plataforma de processamento, quero consumir pedidos da fila RabbitMQ para persistir o pedido e seus itens com consistencia

Criterios de aceite:

- a mensagem de pedido e validada antes da persistencia
- pedido e itens sao persistidos com os campos necessarios aos relatorios
- falhas de consumo sao tratadas de forma observavel e testavel

Historia `BTG-ORD-02`

- como usuario de negocio, quero consultar o valor total do pedido para obter visao financeira por pedido

Criterios de aceite:

- a API retorna o valor total calculado a partir dos itens persistidos
- o contrato documenta a resposta e o comportamento para pedido inexistente
- testes cobrem calculo e cenarios de erro

Historia `BTG-ORD-03`

- como consumidor do sistema, quero listar os pedidos realizados por cliente para acompanhar historico operacional

Criterios de aceite:

- a consulta retorna apenas os pedidos do cliente solicitado
- a resposta e consistente com os dados persistidos pela ingestao

Historia `BTG-ORD-04`

- como time tecnico, quero garantir idempotencia no consumo para evitar duplicidade de agregados

Criterios de aceite:

- reprocessar a mesma mensagem nao gera novo pedido nem agregados incorretos
- a estrategia de retry e erro fica documentada

### `ms-customer`

Historia `BTG-CUS-01`

- como usuario de negocio, quero consultar a quantidade de pedidos por cliente para avaliar volume transacional

Criterios de aceite:

- a API retorna a quantidade correta com base nos pedidos ingeridos
- a documentacao OpenAPI descreve o contrato exposto
- testes cobrem cenario sem pedidos e com multiplos pedidos

Historia `BTG-CUS-02`

- como frontend, quero acessar contratos orientados ao cliente para montar telas de consulta sem logica extra no cliente

Criterios de aceite:

- os endpoints expostos pelo modulo estao alinhados ao consumo do frontend
- erros e estados vazios retornam payloads consistentes

### `frontend`

Historia `BTG-FE-01`

- como operador, quero consultar relatorios por pedido e por cliente em uma interface unica

Criterios de aceite:

- a interface apresenta filtros e resultados para os relatorios definidos como Must Have
- os dados exibidos correspondem aos contratos do backend

Historia `BTG-FE-02`

- como usuario, quero visualizar estados de carregamento, vazio e erro para compreender o resultado da consulta

Criterios de aceite:

- cada fluxo principal exibe feedback coerente em sucesso, erro e ausencia de dados
- falhas de integracao nao quebram a navegacao principal

## 10. RACI Simplificada

| Atividade | Backend | Frontend | QA | DevOps |
| --- | --- | --- | --- | --- |
| Consumo RabbitMQ, persistencia e APIs backend | A/R | I | C | I |
| Telas e integracao do frontend | C | A/R | C | I |
| Estrategia e execucao de testes | R | R | A | C |
| Docker, filas, banco e pipeline | C | I | C | A/R |
| Troubleshooting e readiness de entrega | R | C | C | A/R |

## 11. Priorização MoSCoW

### Must Have

- consumo de pedidos via RabbitMQ
- persistência em MySQL
- APIs para total do pedido, quantidade por cliente e listagem por cliente
- integração frontend com fluxos principais
- testes unitários e de integração para casos críticos
- pipeline de CI com build, testes e cobertura

### Should Have

- idempotência, retry e tratamento de falhas nos consumidores
- contratos OpenAPI atualizados
- troubleshooting e operação local bem documentados

### Could Have

- dashboards e métricas operacionais adicionais
- geração automatizada de client frontend a partir de OpenAPI
- testes de performance nas consultas mais pesadas

### Won't Have (nesta fase)

- ecossistema completo de discovery/gateway dentro deste repositório raiz
- autenticação/autorização corporativa completa
- deploy automatizado em nuvem com observabilidade avançada

## 12. Estimativa por Frente

Referência inicial para planejamento macro:

- foundation e setup de ambiente: 12 a 18 pontos = 6 a 9 dias-pessoa
- domínio `ms-order`: 16 a 24 pontos = 8 a 12 dias-pessoa
- domínio `ms-customer`: 8 a 14 pontos = 4 a 7 dias-pessoa
- frontend e integração: 12 a 18 pontos = 6 a 9 dias-pessoa
- mensageria e consistência: 10 a 16 pontos = 5 a 8 dias-pessoa
- observabilidade e hardening: 8 a 12 pontos = 4 a 6 dias-pessoa

Observações:

- as estimativas consideram complexidade técnica moderada e equipe familiarizada com Spring Boot, Angular, RabbitMQ e MySQL
- a reestimativa deve acontecer ao final de cada sprint com base em throughput real

## 13. Definition of Done

Antes de cada merge:

- testes unitários passando
- testes de integração passando
- contrato OpenAPI atualizado e válido
- cobertura dentro do mínimo acordado
- build Docker funcionando
- pipeline CI verde
- documentação impactada atualizada

## 14. Riscos e Mitigações

Riscos principais:

- inconsistência entre mensagem consumida e modelo persistido
- duplicidade de consumo gerando agregados incorretos
- divergência entre contrato backend e consumo do frontend

Mitigações:

- versionamento de contratos de mensagem e validação de payload
- idempotência no processamento por identificador do pedido
- validação de contrato em CI e integração contínua frontend/backend
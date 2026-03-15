# ADR-001 - Arquitetura Orientada a Eventos

## Status

Aceito

## Contexto

A plataforma BTG Desafio é composta por dois microserviços principais (`ms-customer` e `ms-order`) que precisam:

- Criar e remover entidades (clientes e pedidos) de forma resiliente
- Garantir que a remoção de um cliente cascade-delete os pedidos associados
- Escalar independentemente sem acoplamento direto entre serviços
- Oferecer respostas imediatas à interface mesmo que a persistência seja assíncrona

## Decisão

Adotar arquitetura orientada a eventos usando **RabbitMQ** como message broker AMQP, com as seguintes convenções:

- Cada microserviço possui um **`TopicExchange` dedicado**: `customer.exchange` e `order.exchange`
- **Filas duráveis** por operação: `customer.queue.created`, `customer.queue.deleted`, `order.queue.created`, `order.queue.deleted`
- O **controller publica o evento e retorna `202 Accepted` imediatamente**; a persistência ocorre de forma assíncrona via `@RabbitListener`
- Comunicação síncrona via **OpenFeign** é usada somente quando necessária: cascata de exclusão de pedidos ao remover cliente (`OrderClient.deleteByCustomerId`)
- Proteção de `ms-order` com **Resilience4j Circuit Breaker** na operação de atualização de pedidos

## Consequências

### Positivas

- Baixo acoplamento entre `ms-customer` e `ms-order`
- Escalabilidade independente: consumers e producers podem ser escalados separadamente
- Resiliência: filas duráveis garantem entrega mesmo após reinicialização dos serviços
- Resposta imediata ao cliente (`202 Accepted`), sem aguardar a persistência

### Negativas

- **Consistência eventual**: dados podem não estar persistidos imediatamente após o `202 Accepted`
- Necessidade de controle de **idempotência** nos consumers para evitar processamento duplicado
- Complexidade operacional: RabbitMQ deve estar disponível como dependência de infraestrutura
- Debug mais complexo pela natureza distribuída e assíncrona dos fluxos
- **Ausência de DLQ (Dead Letter Queue)** na implementação atual: mensagens com falha são descartadas. Recomenda-se adicionar DLQ para produção (ver [retry-dlq-pattern.puml](../messaging/retry-dlq-pattern.puml))

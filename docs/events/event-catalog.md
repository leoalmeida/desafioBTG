# Event Catalog

Este documento descreve os eventos publicados e consumidos pela plataforma BTG Desafio.

---

## customer.created

### Exchange
`customer.exchange` (TopicExchange)

### Routing Key
`customer.created`

### Queue
`customer.queue.created` (durable)

### Publisher
`ms-customer` — `CustomerRabbitProducer.publishCustomerCreated(CustomerDto)`

### Consumer
`ms-customer` — `CustomerRabbitListener.handleCustomerCreated(CustomerCreatedEvent)`

### Descrição
Publicado quando `POST /api/v1/customer` é chamado. O controller retorna `202 Accepted` imediatamente. A persistência do cliente no MySQL ocorre de forma assíncrona via consumer.

### Payload (`CustomerCreatedEvent`)
```json
{
  "id":    1,
  "name":  "string",
  "email": "string",
  "phone": "string"
}
```

---

## customer.deleted

### Exchange
`customer.exchange` (TopicExchange)

### Routing Key
`customer.deleted`

### Queue
`customer.queue.deleted` (durable)

### Publisher
`ms-customer` — `CustomerRabbitProducer.publishCustomerDeleted(Long idCustomer)`

### Consumer
`ms-customer` — `CustomerRabbitListener.handleCustomerDeleted(DefaultEvent)`

### Descrição
Publicado quando `DELETE /api/v1/customer/{id}` é chamado. O consumer executa a saga de compensação: remove todos os pedidos do cliente via `OrderClient` (OpenFeign → `ms-order`) e, em seguida, remove o próprio cliente do MySQL.

### Payload (`DefaultEvent`)
```json
{
  "id": 1
}
```

---

## order.created

### Exchange
`order.exchange` (TopicExchange)

### Routing Key
`order.created`

### Queue
`order.queue.created` (durable)

### Publisher
`ms-order` — `OrderRabbitProducer.publishOrderEvent(OrderDto)`

### Consumer
`ms-order` — `OrderRabbitListener.handle(OrderEvent)`

### Descrição
Publicado quando `POST /api/v1/order` é chamado. O controller retorna `202 Accepted` imediatamente. A persistência do pedido e de seus itens no MySQL ocorre de forma assíncrona via consumer. O total é calculado como `sum(preco * quantidade)` sobre os itens.

### Payload (`OrderEvent`)
```json
{
  "codigoPedido":  1,
  "codigoCliente": 1,
  "itens": [
    {
      "produto":    "string",
      "quantidade": 1,
      "preco":      49.90
    }
  ]
}
```

---

## order.deleted

### Exchange
`order.exchange` (TopicExchange)

### Routing Key
`order.deleted`

### Queue
`order.queue.deleted` (durable)

### Publisher
`ms-order` — `OrderRabbitProducer.publishOrderDeleted(Long idOrder)`

### Consumer
`ms-order` — `OrderRabbitListener.handleOrderDeleted(DefaultEvent)`

### Descrição
Publicado quando `DELETE /api/v1/order/{id}` é chamado. O consumer remove o pedido e todos os seus itens do MySQL.

### Payload (`DefaultEvent`)
```json
{
  "id": 1
}
```

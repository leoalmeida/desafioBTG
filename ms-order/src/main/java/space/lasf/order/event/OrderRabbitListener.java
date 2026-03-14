package space.lasf.order.event;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import lombok.extern.slf4j.Slf4j;
import space.lasf.order.configuracao.RabbitConfig;
import space.lasf.order.dto.OrderDto;
import space.lasf.order.dto.OrderItemDto;
import space.lasf.order.service.OrderService;

@Component
@Slf4j
public class OrderRabbitListener {

    private final OrderService orderService;

    @Autowired
    public OrderRabbitListener(OrderService orderService) {
        this.orderService = orderService;
    }

    @RabbitListener(queues = RabbitConfig.QUEUE_CREATED)
    public void handle(OrderEvent event) {
        // Lógica para processar o evento de criação de pedido
        log.info("Pedido criado: {}", event.getCodigoPedido());
        // Aqui você pode adicionar lógica adicional, como atualizar o estoque, enviar notificações, etc.
        OrderDto orderDto = OrderDto.builder()
            .id(event.getCodigoPedido())
            .customerId(event.getCodigoCliente())
            .totalPrice(event.getItens().stream().mapToDouble(i -> i.getPreco() * i.getQuantidade()).sum())
            .itemList(event.getItens().stream()
                .map(i -> OrderItemDto.builder()
                    .orderId(event.getCodigoPedido())
                    .productName(i.getProduto())
                    .quantity(i.getQuantidade())
                    .price(i.getPreco())
                    .build())
                .toList())
            .build();
        this.orderService.createOrder(orderDto);
    }

    @RabbitListener(queues = RabbitConfig.QUEUE_DELETED)
    public void handleOrderDeleted(DefaultEvent event) {
        // Lógica para processar o evento de exclusão de pedido
        log.info("Pedido deletado: {}", event.getId());
        // Aqui você pode adicionar lógica adicional, como atualizar o estoque, enviar notificações, etc.
        this.orderService.deleteOrder(event.getId());
    }
}

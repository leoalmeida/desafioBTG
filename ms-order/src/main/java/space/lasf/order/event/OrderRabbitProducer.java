package space.lasf.order.event;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import space.lasf.order.configuracao.RabbitConfig;
import space.lasf.order.dto.OrderDto;

@Component
public class OrderRabbitProducer {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publishOrderEvent(final OrderDto dto) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.ROUTING_KEY_CREATED,
                OrderEvent.builder()
                    .codigoPedido(dto.getId())
                    .codigoCliente(dto.getCustomerId())
                    .itens(dto.getItemList().stream()
                        .map(i -> OrderItemEvent.builder()
                            .produto(i.getProductName())
                            .quantidade(i.getQuantity())
                            .preco(i.getPrice())
                            .build())
                        .toList())
                    .build());
    }

    public void publishOrderDeleted(final Long idOrder) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.ROUTING_KEY_DELETED,
                new DefaultEvent(idOrder));
    }
}
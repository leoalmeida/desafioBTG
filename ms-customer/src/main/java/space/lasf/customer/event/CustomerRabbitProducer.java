package space.lasf.customer.event;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import space.lasf.customer.configuracao.RabbitConfig;
import space.lasf.customer.dto.CustomerDto;

@Component
public class CustomerRabbitProducer {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publishCustomerCreated(final CustomerDto dto) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.ROUTING_KEY_CREATED,
                new CustomerCreatedEvent(dto.getId(), dto.getName(), dto.getEmail(), dto.getPhone()));
    }

    public void publishCustomerDeleted(final Long idCustomer) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE, RabbitConfig.ROUTING_KEY_DELETED, new DefaultEvent(idCustomer));
    }
}

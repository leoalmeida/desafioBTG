package space.lasf.customer.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import space.lasf.customer.configuracao.RabbitConfig;
import space.lasf.customer.dto.CustomerDto;
import space.lasf.customer.service.CustomerService;

@Component
@Slf4j
public class CustomerRabbitListener {

    private final CustomerService customerService;

    @Autowired
    public CustomerRabbitListener(final CustomerService customerService) {
        this.customerService = customerService;
    }

    @RabbitListener(queues = RabbitConfig.QUEUE_CREATED)
    public void handle(final CustomerCreatedEvent event) {
        // Lógica para processar o evento de criação de cliente
        log.info("Cliente criado: {}", event.getId());
        // Aqui você pode adicionar lógica adicional, como enviar notificações, etc.
        CustomerDto customerDto = CustomerDto.builder()
                .id(event.getId())
                .name(event.getName())
                .email(event.getEmail())
                .phone(event.getPhone())
                .build();
        this.customerService.createCustomer(customerDto);
    }

    @RabbitListener(queues = RabbitConfig.QUEUE_DELETED)
    public void handle(final DefaultEvent event) {
        // Lógica para processar o evento de remoção de cliente
        log.info("Cliente removido: {}", event.getId());
        // Aqui você pode adicionar lógica adicional, como enviar notificações, etc.
        this.customerService.deleteCustomer(event.getId());
    }
}

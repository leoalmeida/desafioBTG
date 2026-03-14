package space.lasf.customer.configuracao;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String EXCHANGE = "customer.exchange";
    public static final String QUEUE_CREATED = "customer.queue.created";
    public static final String QUEUE_DELETED = "customer.queue.deleted";
    public static final String ROUTING_KEY_CREATED = "customer.created";
    public static final String ROUTING_KEY_DELETED = "customer.deleted";

    @Bean
    public TopicExchange customerExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue customerCreatedQueue() {
        return QueueBuilder.durable(QUEUE_CREATED).build();
    }

    @Bean
    public Queue customerDeletedQueue() {
        return QueueBuilder.durable(QUEUE_DELETED).build();
    }

    @Bean
    public Binding customerCreatedBinding() {
        return BindingBuilder.bind(customerCreatedQueue()).to(customerExchange()).with(ROUTING_KEY_CREATED);
    }

    @Bean
    public Binding customerDeletedBinding() {
        return BindingBuilder.bind(customerDeletedQueue()).to(customerExchange()).with(ROUTING_KEY_DELETED);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}

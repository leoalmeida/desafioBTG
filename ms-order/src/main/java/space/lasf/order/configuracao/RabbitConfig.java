package space.lasf.order.configuracao;

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
    public static final String EXCHANGE = "order.exchange";
    public static final String QUEUE_CREATED = "order.queue.created";
    public static final String QUEUE_DELETED = "order.queue.deleted";
    public static final String ROUTING_KEY_CREATED = "order.created";
    public static final String ROUTING_KEY_DELETED = "order.deleted";

    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange(EXCHANGE);
    }
    
    @Bean
    public Queue orderCreatedQueue() {
        return QueueBuilder.durable(QUEUE_CREATED).build();
    }
    
    @Bean
    public Queue orderDeletedQueue() {
        return QueueBuilder.durable(QUEUE_DELETED).build();
    }

    @Bean
    public Binding orderCreatedBinding() {
        return BindingBuilder.bind(orderCreatedQueue()).to(orderExchange()).with(ROUTING_KEY_CREATED);
    }

    @Bean
    public Binding orderDeletedBinding() {
        return BindingBuilder.bind(orderDeletedQueue()).to(orderExchange()).with(ROUTING_KEY_DELETED);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}

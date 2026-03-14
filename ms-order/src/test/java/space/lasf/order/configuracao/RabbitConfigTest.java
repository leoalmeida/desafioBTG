package space.lasf.order.configuracao;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

class RabbitConfigTest {

    private final RabbitConfig config = new RabbitConfig();

    @Test
    void shouldCreateExchangeAndQueuesWithExpectedNames() {
        TopicExchange exchange = config.orderExchange();
        Queue created = config.orderCreatedQueue();
        Queue deleted = config.orderDeletedQueue();

        assertEquals(RabbitConfig.EXCHANGE, exchange.getName());
        assertEquals(RabbitConfig.QUEUE_CREATED, created.getName());
        assertEquals(RabbitConfig.QUEUE_DELETED, deleted.getName());
        assertTrue(created.isDurable());
        assertTrue(deleted.isDurable());
    }

    @Test
    void shouldCreateBindingsWithExpectedRoutingKeys() {
        Binding createdBinding = config.orderCreatedBinding();
        Binding deletedBinding = config.orderDeletedBinding();

        assertEquals(RabbitConfig.EXCHANGE, createdBinding.getExchange());
        assertEquals(RabbitConfig.QUEUE_CREATED, createdBinding.getDestination());
        assertEquals(RabbitConfig.ROUTING_KEY_CREATED, createdBinding.getRoutingKey());

        assertEquals(RabbitConfig.EXCHANGE, deletedBinding.getExchange());
        assertEquals(RabbitConfig.QUEUE_DELETED, deletedBinding.getDestination());
        assertEquals(RabbitConfig.ROUTING_KEY_DELETED, deletedBinding.getRoutingKey());
    }

    @Test
    void shouldUseJacksonMessageConverter() {
        MessageConverter converter = config.messageConverter();

        assertInstanceOf(JacksonJsonMessageConverter.class, converter);
    }
}

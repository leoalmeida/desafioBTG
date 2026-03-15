package space.lasf.order.e2e;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import space.lasf.order.domain.model.Order;
import space.lasf.order.domain.model.OrderItem;
import space.lasf.order.domain.repository.OrderItemRepository;
import space.lasf.order.domain.repository.OrderRepository;

@EnabledIfSystemProperty(named = "docker.e2e", matches = "true")
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("e2e")
class OrderFlowE2ETest {

    @Container
    static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.4")
            .withDatabaseName("orderdb")
            .withUsername("test")
            .withPassword("test");

    @Container
    static final RabbitMQContainer RABBITMQ = new RabbitMQContainer("rabbitmq:3.13-management");

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MYSQL::getJdbcUrl);
        registry.add("spring.datasource.username", MYSQL::getUsername);
        registry.add("spring.datasource.password", MYSQL::getPassword);
        registry.add("spring.rabbitmq.host", RABBITMQ::getHost);
        registry.add("spring.rabbitmq.port", RABBITMQ::getAmqpPort);
        registry.add("spring.rabbitmq.username", RABBITMQ::getAdminUsername);
        registry.add("spring.rabbitmq.password", RABBITMQ::getAdminPassword);
    }

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Value("${local.server.port}")
    private int port;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Test
    void createAndDeleteOrderShouldFlowThroughRabbitAndPersistInMySql() throws Exception {
        String requestBody =
                """
                {
                  \"id\": 9001,
                  \"customerId\": 321,
                  \"totalPrice\": 0,
                  \"itemList\": [
                    {
                      \"productName\": \"Laptop\",
                      \"quantity\": 2,
                      \"price\": 1500.0
                    }
                  ]
                }
                """;

        HttpResponse<String> createResponse = httpClient.send(
                HttpRequest.newBuilder()
                        .uri(URI.create("http://localhost:" + port + "/api/v1/order"))
                        .timeout(Duration.ofSeconds(10))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                        .build(),
                HttpResponse.BodyHandlers.ofString());

        assertEquals(202, createResponse.statusCode());

        awaitUntil(() -> orderRepository.count() == 1 && orderItemRepository.count() == 1);

        Order storedOrder = orderRepository.findAll().get(0);
        List<OrderItem> storedItems = orderItemRepository.findByOrderId(storedOrder.getId());

        assertEquals(321L, storedOrder.getCustomerId());
        assertEquals(3000.0, storedOrder.getTotalPrice());
        assertEquals(1, storedItems.size());
        assertEquals("Laptop", storedItems.get(0).getProductName());
        assertEquals(2, storedItems.get(0).getQuantity());

        HttpResponse<String> deleteResponse = httpClient.send(
                HttpRequest.newBuilder()
                        .uri(URI.create("http://localhost:" + port + "/api/v1/order/" + storedOrder.getId()))
                        .timeout(Duration.ofSeconds(10))
                        .DELETE()
                        .build(),
                HttpResponse.BodyHandlers.ofString());

        assertEquals(204, deleteResponse.statusCode());

        awaitUntil(() -> orderRepository.count() == 0 && orderItemRepository.count() == 0);
    }

    private void awaitUntil(Condition condition) throws Exception {
        long timeoutAt = System.currentTimeMillis() + 15000;
        while (System.currentTimeMillis() < timeoutAt) {
            if (condition.evaluate()) {
                return;
            }
            Thread.sleep(250);
        }
        assertTrue(condition.evaluate(), "Condition was not met within timeout");
    }

    @FunctionalInterface
    private interface Condition {
        boolean evaluate() throws Exception;
    }
}

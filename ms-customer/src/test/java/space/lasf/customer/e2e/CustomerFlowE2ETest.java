package space.lasf.customer.e2e;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import space.lasf.customer.domain.model.Customer;
import space.lasf.customer.domain.repository.CustomerRepository;
import space.lasf.customer.dto.OrderDto;
import space.lasf.customer.http.OrderClient;

@EnabledIfSystemProperty(named = "docker.e2e", matches = "true")
@Testcontainers(disabledWithoutDocker = true)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("e2e")
class CustomerFlowE2ETest {

    @Container
    static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.4")
            .withDatabaseName("customerdb")
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

    @TestConfiguration
    static class StubOrderClientConfig {
        @Bean
        @Primary
        OrderClient orderClient() {
            return new OrderClient() {
                @Override
                public List<OrderDto> findOrdersByCustomerId(Long customerId) {
                    return List.of();
                }

                @Override
                public void deleteByCustomerId(Long customerId) {}
            };
        }
    }

    @Autowired
    private CustomerRepository customerRepository;

    @Value("${local.server.port}")
    private int port;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Test
    void createAndDeleteCustomerShouldFlowThroughRabbitAndPersistInMySql() throws Exception {
        String requestBody =
                """
                {
                  \"id\": 7001,
                  \"name\": \"Maria\",
                  \"email\": \"maria@test.com\",
                  \"phone\": \"11999998888\"
                }
                """;

        HttpResponse<String> createResponse = httpClient.send(
                HttpRequest.newBuilder()
                        .uri(URI.create("http://localhost:" + port + "/api/v1/customer"))
                        .timeout(Duration.ofSeconds(10))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                        .build(),
                HttpResponse.BodyHandlers.ofString());

        assertEquals(202, createResponse.statusCode());

        awaitUntil(() -> customerRepository.count() == 1);

        Customer storedCustomer = customerRepository.findAll().get(0);
        assertEquals("Maria", storedCustomer.getName());
        assertEquals("maria@test.com", storedCustomer.getEmail());

        HttpResponse<String> deleteResponse = httpClient.send(
                HttpRequest.newBuilder()
                        .uri(URI.create("http://localhost:" + port + "/api/v1/customer/" + storedCustomer.getId()))
                        .timeout(Duration.ofSeconds(10))
                        .DELETE()
                        .build(),
                HttpResponse.BodyHandlers.ofString());

        assertEquals(202, deleteResponse.statusCode());

        awaitUntil(() -> customerRepository.count() == 0);
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

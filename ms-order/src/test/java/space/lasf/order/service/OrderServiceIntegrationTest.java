package space.lasf.order.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import space.lasf.order.domain.repository.OrderItemRepository;
import space.lasf.order.domain.repository.OrderRepository;
import space.lasf.order.dto.OrderDto;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class OrderServiceIntegrationTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @BeforeEach
    void cleanUp() {
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
    }

    @Test
    void createOrderAndGetByIdShouldPersistData() {
        OrderDto payload = OrderDto.builder()
                .customerId(101L)
                .totalPrice(199.8)
                .itemList(List.of())
                .build();

        OrderDto created = orderService.createOrder(payload);

        assertNotNull(created.getId());
        assertEquals(101L, created.getCustomerId());
        assertEquals(0, created.getItemList().size());

        OrderDto loaded = orderService.getOrderById(created.getId());
        assertEquals(created.getId(), loaded.getId());
        assertEquals(101L, loaded.getCustomerId());
        assertEquals(199.8, loaded.getTotalPrice());
    }

    @Test
    void deleteOrderShouldRemovePersistedOrder() {
        OrderDto payload = OrderDto.builder()
                .customerId(202L)
                .totalPrice(250.0)
                .itemList(List.of())
                .build();

        OrderDto created = orderService.createOrder(payload);
        Long orderId = created.getId();

        orderService.deleteOrder(orderId);

        assertEquals(0, orderRepository.count());
    }

    @Test
    void deleteOrderShouldThrowWhenOrderDoesNotExist() {
        assertThrows(IllegalArgumentException.class, () -> orderService.deleteOrder(9999L));
    }
}

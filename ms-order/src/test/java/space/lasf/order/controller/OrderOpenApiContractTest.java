package space.lasf.order.controller;

import static com.atlassian.oai.validator.mockmvc.OpenApiValidationMatchers.openApi;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import space.lasf.order.core.component.GlobalExceptionHandler;
import space.lasf.order.core.exception.BusinessException;
import space.lasf.order.dto.OrderDto;
import space.lasf.order.dto.OrderItemDto;
import space.lasf.order.event.OrderRabbitProducer;
import space.lasf.order.service.OrderService;

class OrderOpenApiContractTest {

    private static final String OPEN_API_SPEC = "/openapi/orders-openapi.yaml";

    private MockMvc mockMvc;
    private OrderService orderService;
    private OrderRabbitProducer producer;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        orderService = mock(OrderService.class);
        producer = mock(OrderRabbitProducer.class);

        OrderController controller = new OrderController();
        ReflectionTestUtils.setField(controller, "orderService", orderService);
        ReflectionTestUtils.setField(controller, "producer", producer);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getOrdersShouldMatchContract() throws Exception {
        List<OrderDto> orders = List.of(
                OrderDto.builder().id(1L).customerId(9L).totalPrice(12.5).build());
        when(orderService.getAllOrders()).thenReturn(orders);

        mockMvc.perform(get("/api/v1/order").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getOrderByIdShouldMatchContract() throws Exception {
        OrderDto order = OrderDto.builder().id(2L).customerId(7L).totalPrice(30.0).build();
        when(orderService.getOrderById(2L)).thenReturn(order);

        mockMvc.perform(get("/api/v1/order/2").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getOrderByIdNotFoundShouldMatchContract() throws Exception {
        when(orderService.getOrderById(99L)).thenThrow(new NoSuchElementException("not found"));

        mockMvc.perform(get("/api/v1/order/99").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void businessErrorShouldMatchContract() throws Exception {
        when(orderService.getOrderById(5L)).thenThrow(new BusinessException("regra violada"));

        mockMvc.perform(get("/api/v1/order/5").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getQuantityOrdersByCustomerIdShouldMatchContract() throws Exception {
        when(orderService.getOrdersByCustomerId(10L))
                .thenReturn(List.of(OrderDto.builder().id(1L).customerId(10L).build()));

        mockMvc.perform(get("/api/v1/order/quantity/10").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getOrdersByCustomerIdShouldMatchContract() throws Exception {
        when(orderService.getOrdersByCustomerId(10L))
                .thenReturn(List.of(OrderDto.builder().id(1L).customerId(10L).build()));

        mockMvc.perform(get("/api/v1/order/customer/10").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void isOrderValidShouldMatchContract() throws Exception {
        when(orderService.getOrderById(3L)).thenReturn(OrderDto.builder().id(3L).build());

        mockMvc.perform(get("/api/v1/order/3/exists").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getOrderTotalShouldMatchContract() throws Exception {
        OrderDto order = OrderDto.builder()
                .id(1L)
                .customerId(2L)
                .totalPrice(50.0)
                .itemList(List.of(
                        OrderItemDto.builder().id(1L).orderId(1L).productName("Item").quantity(2).price(25.0).build()))
                .build();
        when(orderService.getOrderById(1L)).thenReturn(order);

        mockMvc.perform(get("/api/v1/order/1/total").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getOrderTotalNotFoundShouldMatchContract() throws Exception {
        when(orderService.getOrderById(99L)).thenReturn(null);

        mockMvc.perform(get("/api/v1/order/99/total").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void createOrderShouldMatchContract() throws Exception {
        OrderDto request = OrderDto.builder().customerId(1L).build();

        mockMvc.perform(post("/api/v1/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isAccepted())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void updateOrderShouldMatchContract() throws Exception {
        OrderDto request = OrderDto.builder().id(1L).customerId(2L).totalPrice(80.0).build();
        when(orderService.updateOrder(any())).thenReturn(request);

        mockMvc.perform(put("/api/v1/order/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void removeOrdersByCustomerIdShouldMatchContract() throws Exception {
        mockMvc.perform(delete("/api/v1/order/customer/10"))
                .andExpect(status().isNoContent())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void removeOrderShouldMatchContract() throws Exception {
        mockMvc.perform(delete("/api/v1/order/1"))
                .andExpect(status().isNoContent())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }
}

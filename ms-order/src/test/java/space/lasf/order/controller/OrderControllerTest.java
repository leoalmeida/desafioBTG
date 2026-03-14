package space.lasf.order.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import space.lasf.order.dto.OrderDto;
import space.lasf.order.event.OrderRabbitProducer;
import space.lasf.order.service.OrderService;

class OrderControllerTest {

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

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void getOrdersShouldReturnOk() throws Exception {
        List<OrderDto> orders = List.of(OrderDto.builder().id(1L).customerId(9L).totalPrice(12.5).build());
        when(orderService.getAllOrders()).thenReturn(orders);

        mockMvc.perform(get("/api/v1/order"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].customerId").value(9));

        verify(orderService).getAllOrders();
    }

    @Test
    void getOrderByIdShouldReturnOk() throws Exception {
        OrderDto order = OrderDto.builder().id(2L).customerId(7L).totalPrice(30.0).build();
        when(orderService.getOrderById(2L)).thenReturn(order);

        mockMvc.perform(get("/api/v1/order/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.customerId").value(7));

        verify(orderService).getOrderById(2L);
    }

    @Test
    void isOrderValidShouldReturnTrue() throws Exception {
        when(orderService.getOrderById(3L)).thenReturn(OrderDto.builder().id(3L).build());

        mockMvc.perform(get("/api/v1/order/3/exists"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(orderService).getOrderById(3L);
    }

    @Test
    void getOrdersByCustomerIdShouldReturnOk() throws Exception {
        when(orderService.getOrdersByCustomerId(10L)).thenReturn(List.of(OrderDto.builder().id(1L).customerId(10L).build()));

        mockMvc.perform(get("/api/v1/order/customer/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerId").value(10));

        verify(orderService).getOrdersByCustomerId(10L);
    }

    @Test
    void createOrderShouldReturnAccepted() throws Exception {
        OrderDto payload = OrderDto.builder().id(4L).customerId(1L).totalPrice(19.9).build();

        mockMvc.perform(post("/api/v1/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isAccepted());

        verify(producer).publishOrderEvent(any(OrderDto.class));
    }

    @Test
    void updateOrderShouldReturnOk() throws Exception {
        OrderDto payload = OrderDto.builder().id(4L).customerId(1L).totalPrice(29.9).build();
        when(orderService.updateOrder(any(OrderDto.class))).thenReturn(payload);

        mockMvc.perform(put("/api/v1/order/4")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4))
                .andExpect(jsonPath("$.totalPrice").value(29.9));

        verify(orderService).updateOrder(any(OrderDto.class));
    }

    @Test
    void removeOrdersByCustomerIdShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/v1/order/customer/11"))
                .andExpect(status().isNoContent());

        verify(orderService).deleteOrdersByCustomerId(11L);
    }

    @Test
    void removeOrderShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/v1/order/12"))
                .andExpect(status().isNoContent());

        verify(producer).publishOrderDeleted(12L);
    }
}

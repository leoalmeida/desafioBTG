package space.lasf.order.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.test.util.ReflectionTestUtils;
import space.lasf.order.core.util.ObjectsValidator;
import space.lasf.order.domain.model.Order;
import space.lasf.order.domain.model.OrderItem;
import space.lasf.order.domain.repository.OrderItemRepository;
import space.lasf.order.domain.repository.OrderRepository;
import space.lasf.order.dto.OrderDto;
import space.lasf.order.dto.OrderItemDto;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository repository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private ObjectsValidator<Order> validador;

    @Mock
    private ObjectsValidator<OrderItem> itemValidator;

    private OrderServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new OrderServiceImpl(repository, orderItemRepository, validador, itemValidator);
        ReflectionTestUtils.setField(service, "modelMapper", modelMapper);
    }

    @Test
    void createOrderShouldSaveOrderAndItems() {
        OrderItemDto itemIn = OrderItemDto.builder()
                .productName("Book")
                .quantity(2)
                .price(10.0)
                .build();
        OrderDto dtoIn = OrderDto.builder()
                .customerId(7L)
                .totalPrice(20.0)
                .itemList(List.of(itemIn))
                .build();

        Order orderEntity =
                Order.builder().id(99L).customerId(7L).totalPrice(20.0).build();
        Order savedOrder =
                Order.builder().id(1L).customerId(7L).totalPrice(20.0).build();

        OrderItem itemEntity = OrderItem.builder()
                .id(50L)
                .productName("Book")
                .quantity(2)
                .price(10.0)
                .build();
        OrderItemDto itemOut = OrderItemDto.builder()
                .orderId(1L)
                .productName("Book")
                .quantity(2)
                .price(10.0)
                .build();
        OrderDto mappedOrderOut =
                OrderDto.builder().id(1L).customerId(7L).totalPrice(20.0).build();

        when(modelMapper.map(dtoIn, Order.class)).thenReturn(orderEntity);
        when(repository.save(orderEntity)).thenReturn(savedOrder);
        when(modelMapper.map(itemIn, OrderItem.class)).thenReturn(itemEntity);
        when(modelMapper.map(savedOrder, OrderDto.class)).thenReturn(mappedOrderOut);
        when(modelMapper.map(itemEntity, OrderItemDto.class)).thenReturn(itemOut);

        OrderDto result = service.createOrder(dtoIn);

        assertEquals(1L, result.getId());
        assertEquals(1, result.getItemList().size());
        assertEquals("Book", result.getItemList().get(0).getProductName());

        verify(validador).validate(orderEntity);
        verify(itemValidator).validate(itemEntity);

        ArgumentCaptor<List<OrderItem>> itemsCaptor = ArgumentCaptor.forClass(List.class);
        verify(orderItemRepository).saveAll(itemsCaptor.capture());
        assertEquals(1L, itemsCaptor.getValue().get(0).getOrderId());
    }

    @Test
    void deleteOrderShouldDeleteWhenOrderExists() {
        when(repository.findById(10L))
                .thenReturn(Optional.of(Order.builder().id(10L).build()));

        service.deleteOrder(10L);

        verify(orderItemRepository).deleteByOrderId(10L);
        verify(repository).deleteById(10L);
    }

    @Test
    void deleteOrderShouldThrowWhenOrderDoesNotExist() {
        when(repository.findById(10L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.deleteOrder(10L));

        assertTrue(ex.getMessage().contains("Pedido não encontrado"));
        verify(orderItemRepository, never()).deleteByOrderId(10L);
        verify(repository, never()).deleteById(10L);
    }

    @Test
    void deleteOrdersByCustomerIdShouldReturnFalseWhenNoOrders() {
        when(repository.findByCustomerId(42L)).thenReturn(List.of());

        boolean removed = service.deleteOrdersByCustomerId(42L);

        assertFalse(removed);
        verify(repository, never()).deleteByCustomerId(42L);
    }

    @Test
    void deleteOrdersByCustomerIdShouldReturnTrueWhenOrdersExist() {
        Order order = Order.builder().id(1L).customerId(42L).totalPrice(5.0).build();
        when(repository.findByCustomerId(42L)).thenReturn(List.of(order));
        when(modelMapper.map(order, OrderDto.class))
                .thenReturn(OrderDto.builder().id(1L).customerId(42L).build());

        boolean removed = service.deleteOrdersByCustomerId(42L);

        assertTrue(removed);
        verify(repository).deleteByCustomerId(42L);
    }
}

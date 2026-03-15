package space.lasf.order.service;

import java.util.List;
import space.lasf.order.dto.OrderDto;

/**
 * Serviço para gerenciamento de pedidos.
 */
public interface OrderService {

    OrderDto createOrder(OrderDto order);

    OrderDto updateOrder(OrderDto order);

    OrderDto getOrderById(Long id);

    List<OrderDto> getAllOrders();

    List<OrderDto> getOrdersByCustomerId(Long customerId);

    void deleteOrder(Long id);

    boolean deleteOrdersByCustomerId(Long customerId);
}

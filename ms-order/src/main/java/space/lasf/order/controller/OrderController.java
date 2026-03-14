package space.lasf.order.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import space.lasf.order.dto.OrderDto;
import space.lasf.order.event.OrderRabbitProducer;
import space.lasf.order.service.OrderService;

/**
 * Controller para gerenciamento de pedidos.
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRabbitProducer producer;

    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrders() {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(orderService.getAllOrders());
    }

    @GetMapping("/quantity/{customerId}")
    public ResponseEntity<Long> getQuantityOrdersByCustomerId(@PathVariable final Long customerId) {
        List<OrderDto> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok((long) orders.size());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable final Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable final Long orderId) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(orderService.getOrderById(orderId));
    }

    @GetMapping("/{orderId}/exists")
    public ResponseEntity<Boolean> isOrderValid(@PathVariable final Long orderId) {
        OrderDto dto = orderService.getOrderById(orderId);
        return ResponseEntity.ok(null != dto);
    }

    @GetMapping("/{orderId}/total")
    public ResponseEntity<Double> getOrderTotal(@PathVariable final Long orderId) {
        OrderDto dto = orderService.getOrderById(orderId);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        double total = dto.getItemList().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        return ResponseEntity.ok(total);
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @RequestBody @Valid final OrderDto order, final UriComponentsBuilder uriBuilder) {
        producer.publishOrderEvent(order);
        return ResponseEntity.accepted().build();
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<OrderDto> updateOrder(
            @PathVariable final Long orderId, @RequestBody final OrderDto order) {
        OrderDto dto = orderService.updateOrder(order);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/customer/{customerId}")
    public ResponseEntity<Void> removeOrdersByCustomerId(@PathVariable final Long customerId) {
        orderService.deleteOrdersByCustomerId(customerId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> removeOrder(@PathVariable final Long orderId) {
        producer.publishOrderDeleted(orderId);
        return ResponseEntity.noContent().build();
    }


}

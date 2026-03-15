package space.lasf.customer.http;

import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import space.lasf.customer.dto.OrderDto;

@FeignClient("ms-order")
public interface OrderClient {

    @GetMapping("/api/v1/order/{customerId}")
    List<OrderDto> findOrdersByCustomerId(@PathVariable Long customerId);

    @DeleteMapping("/api/v1/order/delete/client/{customerId}")
    void deleteByCustomerId(@PathVariable Long customerId);
}

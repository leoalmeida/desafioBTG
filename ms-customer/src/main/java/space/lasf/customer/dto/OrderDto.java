package space.lasf.customer.dto;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class OrderDto {
    private Long id;
    private Long customerId;
    private Double totalPrice;
    private List<OrderItemDto> itemList;
}

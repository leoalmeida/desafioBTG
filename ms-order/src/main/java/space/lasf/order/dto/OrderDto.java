package space.lasf.order.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class OrderDto {

    private Long id;
    private Long customerId;
    private Double totalPrice;
    private List<OrderItemDto> itemList;
}

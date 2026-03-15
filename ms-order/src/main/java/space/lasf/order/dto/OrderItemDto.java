package space.lasf.order.dto;

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
public class OrderItemDto {

    private Long id;
    private Long orderId;
    private String productName;
    private Integer quantity;
    private Double price;
}

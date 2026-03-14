package space.lasf.customer.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class OrderItemDto {
    
    private Long id;
    private Long orderId;
    private String productName;
    private Integer quantity;
    private Double price;
    
}

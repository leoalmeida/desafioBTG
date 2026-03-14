package space.lasf.customer.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class CustomerDto {
    private Long id;
    private String email;
    private String name;
    private String phone;
    private List<OrderDto> orderList;
}

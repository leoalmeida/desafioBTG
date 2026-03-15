package space.lasf.order.event;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class OrderEvent {
    private Long codigoPedido;
    private Long codigoCliente;
    private List<OrderItemEvent> itens;
}

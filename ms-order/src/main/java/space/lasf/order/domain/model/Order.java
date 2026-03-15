package space.lasf.order.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.io.Serial;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidade que representa um pedido.
 */
@Entity
@Table(
        name = "orders",
        indexes = {@Index(name = "orders_search_key_idx", columnList = "customer_id", unique = false)})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "total_price")
    private Double totalPrice;

    public Order updateData(final Order order) {
        this.customerId = order.getCustomerId();
        this.totalPrice = order.getTotalPrice();
        return this;
    }
}

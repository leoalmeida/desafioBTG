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
 * Entidade que representa um item de pedido.
 */
@Entity
@Table(
        name = "order_items",
        indexes = {@Index(name = "order_items_search_key_idx", columnList = "order_id", unique = false)})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Double price;

    public OrderItem updateData(final OrderItem orderItem) {
        this.orderId = orderItem.getOrderId();
        this.productName = orderItem.getProductName();
        this.quantity = orderItem.getQuantity();
        this.price = orderItem.getPrice();
        return this;
    }
}

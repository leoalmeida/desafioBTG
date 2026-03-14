package space.lasf.order.domain.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import space.lasf.order.domain.model.OrderItem;

/**
 * Repositório para a entidade de OrderItem.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("select o from OrderItem o where o.orderId = ?1")
    List<OrderItem> findByOrderId(final Long idOrder);

    @Modifying
    @Query("delete from OrderItem o where o.orderId = ?1")
    void deleteByOrderId(final Long idOrder);
    
}

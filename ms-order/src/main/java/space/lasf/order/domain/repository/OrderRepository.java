package space.lasf.order.domain.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import space.lasf.order.domain.model.Order;

/**
 * Repositório para a entidade de Order.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("select o from Order o where o.customerId = ?1")
    List<Order> findByCustomerId(final Long customerId);

    @Modifying
    @Query("delete from Order o where o.customerId = ?1")
    void deleteByCustomerId(final Long customerId);
}

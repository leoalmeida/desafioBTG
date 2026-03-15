package space.lasf.customer.domain.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import space.lasf.customer.domain.model.Customer;

/**
 * Repositório para a entidade de Cliente.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Query("select c from Customer c where c.email = ?1")
    Optional<Customer> findByEmail(String email);

    @Query("select c from Customer c where c.name like %?1%")
    List<Customer> findByNameContaining(String name);
}

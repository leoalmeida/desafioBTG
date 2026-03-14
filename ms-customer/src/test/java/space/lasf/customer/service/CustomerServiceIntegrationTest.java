package space.lasf.customer.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import space.lasf.customer.domain.repository.CustomerRepository;
import space.lasf.customer.dto.CustomerDto;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CustomerServiceIntegrationTest {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    @BeforeEach
    void cleanUp() {
        customerRepository.deleteAll();
    }

    @Test
    void createCustomerShouldPersistData() {
        CustomerDto payload = CustomerDto.builder()
                .name("Joao")
                .email("joao@test.com")
                .phone("11988887777")
                .build();

        CustomerDto created = customerService.createCustomer(payload);

        assertNotNull(created.getId());
        assertEquals("joao@test.com", created.getEmail());
        assertEquals(1, customerRepository.count());
    }

    @Test
    void updateCustomerShouldPersistChanges() {
        CustomerDto created = customerService.createCustomer(CustomerDto.builder()
                .name("Maria")
                .email("maria@test.com")
                .phone("11977776666")
                .build());

        CustomerDto updatePayload = CustomerDto.builder()
                .id(created.getId())
                .name("Maria Silva")
                .email("maria.silva@test.com")
                .phone("11977770000")
                .build();

        CustomerDto updated = customerService.updateCustomer(updatePayload);

        assertEquals(created.getId(), updated.getId());
        assertEquals("Maria Silva", updated.getName());
        assertEquals("maria.silva@test.com", updated.getEmail());
    }

    @Test
    void getAllCustomersShouldReturnPersistedCustomers() {
        customerService.createCustomer(CustomerDto.builder()
                .name("A")
                .email("a@test.com")
                .phone("1")
                .build());
        customerService.createCustomer(CustomerDto.builder()
                .name("B")
                .email("b@test.com")
                .phone("2")
                .build());

        List<CustomerDto> all = customerService.getAllCustomers();

        assertEquals(2, all.size());
    }

    @Test
    void createCustomerShouldThrowWhenEmailInvalid() {
        CustomerDto payload = CustomerDto.builder()
                .name("Invalid")
                .email("invalid-email")
                .phone("11900000000")
                .build();

        assertThrows(IllegalArgumentException.class, () -> customerService.createCustomer(payload));
    }
}

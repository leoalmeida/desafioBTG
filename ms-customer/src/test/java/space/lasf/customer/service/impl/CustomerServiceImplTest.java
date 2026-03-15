package space.lasf.customer.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import space.lasf.customer.core.util.ObjectsValidator;
import space.lasf.customer.domain.model.Customer;
import space.lasf.customer.domain.repository.CustomerRepository;
import space.lasf.customer.dto.CustomerDto;
import space.lasf.customer.dto.OrderDto;
import space.lasf.customer.http.OrderClient;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

    @Mock
    private CustomerRepository repository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private OrderClient orderClient;

    @Mock
    private ObjectsValidator<Customer> validador;

    @InjectMocks
    private CustomerServiceImpl service;

    @Test
    void validateCustomerEmailShouldAcceptValidEmail() {
        assertTrue(service.validateCustomerEmail("alice@example.com"));
    }

    @Test
    void validateCustomerEmailShouldRejectInvalidEmail() {
        assertFalse(service.validateCustomerEmail("bad-email"));
    }

    @Test
    void createCustomerShouldThrowWhenEmailIsInvalid() {
        CustomerDto dto = CustomerDto.builder().email("invalid").name("Alice").build();
        Customer customerEntity =
                Customer.builder().email("invalid").name("Alice").build();
        when(modelMapper.map(dto, Customer.class)).thenReturn(customerEntity);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.createCustomer(dto));

        assertTrue(ex.getMessage().contains("Email inválido"));
        verify(repository, never()).save(customerEntity);
    }

    @Test
    void createCustomerShouldPersistAndReturnDto() {
        CustomerDto dtoIn = CustomerDto.builder()
                .email("alice@example.com")
                .name("Alice")
                .phone("1199999")
                .build();
        Customer entityIn = Customer.builder()
                .id(10L)
                .email("alice@example.com")
                .name("Alice")
                .phone("1199999")
                .build();
        Customer saved = Customer.builder()
                .id(1L)
                .email("alice@example.com")
                .name("Alice")
                .phone("1199999")
                .build();
        CustomerDto dtoOut = CustomerDto.builder()
                .id(1L)
                .email("alice@example.com")
                .name("Alice")
                .phone("1199999")
                .build();

        when(modelMapper.map(dtoIn, Customer.class)).thenReturn(entityIn);
        when(repository.save(entityIn)).thenReturn(saved);
        when(modelMapper.map(saved, CustomerDto.class)).thenReturn(dtoOut);

        CustomerDto result = service.createCustomer(dtoIn);

        assertEquals(1L, result.getId());
        assertEquals("alice@example.com", result.getEmail());
        verify(validador).validate(entityIn);
    }

    @Test
    void deleteCustomerShouldThrowWhenOrderServiceFails() {
        when(repository.findById(9L))
                .thenReturn(Optional.of(Customer.builder().id(9L).build()));
        doThrow(new RuntimeException("order service error")).when(orderClient).deleteByCustomerId(9L);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> service.deleteCustomer(9L));

        assertTrue(ex.getMessage().contains("Cannot delete customer"));
        verify(repository, never()).deleteById(9L);
    }

    @Test
    void getCustomerByEmailShouldAttachOrders() {
        Customer customer = Customer.builder()
                .id(3L)
                .email("alice@example.com")
                .name("Alice")
                .build();
        CustomerDto dto = CustomerDto.builder()
                .id(3L)
                .email("alice@example.com")
                .name("Alice")
                .build();
        List<OrderDto> orders = List.of(new OrderDto());

        when(repository.findByEmail("alice@example.com")).thenReturn(Optional.of(customer));
        when(orderClient.findOrdersByCustomerId(3L)).thenReturn(orders);
        when(modelMapper.map(customer, CustomerDto.class)).thenReturn(dto);

        CustomerDto result = service.getCustomerByEmail("alice@example.com");

        assertEquals(1, result.getOrderList().size());
        verify(orderClient).findOrdersByCustomerId(3L);
    }
}

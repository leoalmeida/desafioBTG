package space.lasf.customer.service.impl;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import space.lasf.customer.core.util.ObjectsValidator;
import space.lasf.customer.domain.model.Customer;
import space.lasf.customer.domain.repository.CustomerRepository;
import space.lasf.customer.dto.CustomerDto;
import space.lasf.customer.dto.OrderDto;
import space.lasf.customer.service.CustomerService;
import space.lasf.customer.http.OrderClient;

/**
 * Implementação do serviço para gerenciamento de clientes.
 */
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private final CustomerRepository repository;

    @Autowired
    private final ModelMapper modelMapper;

    @Autowired
    private final OrderClient orderClient;

    @Autowired
    private final ObjectsValidator<Customer> validador;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9+_.-]+\\.[a-z]{2,4}$");

    @Override
    @Transactional
    public CustomerDto createCustomer(final CustomerDto dto) {
        Customer entity = modelMapper.map(dto, Customer.class);
        if (!validateCustomerEmail(entity.getEmail())) {
            throw new IllegalArgumentException("Email inválido: " + dto.getEmail());
        }
        entity.setId(null); // Garante que o ID seja nulo para criação
        validador.validate(entity);

        Customer result = repository.save(entity);

        return modelMapper.map(result, CustomerDto.class);
    }

    @Override
    @Transactional
    public CustomerDto updateCustomer(final CustomerDto dto) {
        Customer entity = modelMapper.map(dto, Customer.class);
        if (!validateCustomerEmail(entity.getEmail())) {
            throw new IllegalArgumentException("Email inválido: " + dto.getEmail());
        }
        validador.validate(entity);
        Customer result = repository.save(entity);

        return modelMapper.map(result, CustomerDto.class);
    }

    @Override
    @Transactional
    public void deleteCustomer(final Long id) {
        if (repository.findById(id).isPresent()) {
            try {
                orderClient.deleteByCustomerId(id);
            } catch (Exception e) {
                throw new IllegalStateException("Cannot delete customer with existing orders. Customer ID: " + id, e);
            }
            repository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Customer not found with ID: " + id);
        }
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.SERIALIZABLE)
    public CustomerDto getCustomerById(final Long id) {
        Customer entityIn = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + id));
        List<OrderDto> orderList = orderClient.findOrdersByCustomerId(id);
        CustomerDto dtoOut = modelMapper.map(entityIn, CustomerDto.class);
        dtoOut.setOrderList(orderList);
        return dtoOut;
    }

    @Override
    public CustomerDto getCustomerByEmail(final String email) {
        if (!validateCustomerEmail(email)) {
            throw new IllegalArgumentException("Invalid email: " + email);
        }

        Customer result = repository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with email: " + email));
        List<OrderDto> orderList = orderClient.findOrdersByCustomerId(result.getId());
        CustomerDto dtoOut = modelMapper.map(result, CustomerDto.class);
        dtoOut.setOrderList(orderList);
        return dtoOut;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerDto> getAllCustomers() {
        return repository.findAll().stream()
                .map(p -> modelMapper.map(p, CustomerDto.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerDto> getCustomersByName(final String name) {
        return repository.findByNameContaining(name).stream()
                .map(p -> modelMapper.map(p, CustomerDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean validateCustomerEmail(final String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }

        return EMAIL_PATTERN.matcher(email).matches();
    }
}

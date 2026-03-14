package space.lasf.customer.service;

import java.util.List;
import space.lasf.customer.dto.CustomerDto;

/**
 * Serviço para gerenciamento de clientes.
 */
public interface CustomerService {

    CustomerDto createCustomer(CustomerDto customer);

    CustomerDto getCustomerById(Long idCustomer);

    CustomerDto getCustomerByEmail(String email);

    List<CustomerDto> getAllCustomers();

    List<CustomerDto> getCustomersByName(String name);

    CustomerDto updateCustomer(CustomerDto customer);

    void deleteCustomer(Long idCustomer);

    boolean validateCustomerEmail(String email);
}

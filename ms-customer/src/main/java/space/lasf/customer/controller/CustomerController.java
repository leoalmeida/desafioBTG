package space.lasf.customer.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;
import space.lasf.customer.dto.CustomerDto;
import space.lasf.customer.dto.OrderDto;
import space.lasf.customer.event.CustomerRabbitProducer;
import space.lasf.customer.http.OrderClient;
import space.lasf.customer.service.CustomerService;

/**
 * Controller para gerenciamento de clientes.
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRabbitProducer producer;

    @Autowired
    private OrderClient orderClient;

    @GetMapping
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable final Long id) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(customerService.getCustomerById(id));
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<OrderDto>> getCustomerOrders(@PathVariable final Long id) {
        List<OrderDto> orders = orderClient.findOrdersByCustomerId(id);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkCustomerExists(@PathVariable final Long id) {
        CustomerDto dto = customerService.getCustomerById(id);
        return ResponseEntity.ok(null != dto);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<CustomerDto> getCustomerByEmail(@PathVariable final String email) {
        if (!customerService.validateCustomerEmail(email)) {
            return ResponseEntity.notFound().build();
        }
        CustomerDto dto = customerService.getCustomerByEmail(email);

        return (null == dto) ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<CustomerDto>> searchCustomersByName(@RequestParam("name") final String name) {
        return ResponseEntity.ok(customerService.getCustomersByName(name));
    }

    @PostMapping
    public ResponseEntity<CustomerDto> createCustomer(
            @RequestBody @Valid final CustomerDto customer, final UriComponentsBuilder uriBuilder) {
        producer.publishCustomerCreated(customer);
        return ResponseEntity.accepted().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(
            @PathVariable final Long id, @RequestBody final CustomerDto customer) {
        CustomerDto dto = customerService.updateCustomer(customer);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable final Long id) {
        producer.publishCustomerDeleted(id);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/validate-email")
    public ResponseEntity<Boolean> validateEmail(@RequestParam("email") final String email) {
        if (customerService.validateCustomerEmail(email)) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }
    }
}

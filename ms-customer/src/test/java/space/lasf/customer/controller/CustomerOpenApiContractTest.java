package space.lasf.customer.controller;

import static com.atlassian.oai.validator.mockmvc.OpenApiValidationMatchers.openApi;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import space.lasf.customer.core.component.GlobalExceptionHandler;
import space.lasf.customer.core.exception.BusinessException;
import space.lasf.customer.dto.CustomerDto;
import space.lasf.customer.dto.OrderDto;
import space.lasf.customer.event.CustomerRabbitProducer;
import space.lasf.customer.http.OrderClient;
import space.lasf.customer.service.CustomerService;

class CustomerOpenApiContractTest {

    private static final String OPEN_API_SPEC = "/openapi/customers-openapi.yaml";

    private MockMvc mockMvc;
    private CustomerService customerService;
    private CustomerRabbitProducer producer;
    private OrderClient orderClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        customerService = mock(CustomerService.class);
        producer = mock(CustomerRabbitProducer.class);
        orderClient = mock(OrderClient.class);

        CustomerController controller = new CustomerController();
        ReflectionTestUtils.setField(controller, "customerService", customerService);
        ReflectionTestUtils.setField(controller, "producer", producer);
        ReflectionTestUtils.setField(controller, "orderClient", orderClient);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getAllCustomersShouldMatchContract() throws Exception {
        List<CustomerDto> customers = List.of(
                CustomerDto.builder().id(1L).name("Ana").email("ana@test.com").build());
        when(customerService.getAllCustomers()).thenReturn(customers);

        mockMvc.perform(get("/api/v1/customer").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getCustomerByIdShouldMatchContract() throws Exception {
        CustomerDto customer = CustomerDto.builder().id(2L).name("Leo").email("leo@test.com").build();
        when(customerService.getCustomerById(2L)).thenReturn(customer);

        mockMvc.perform(get("/api/v1/customer/2").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getCustomerByIdNotFoundShouldMatchContract() throws Exception {
        when(customerService.getCustomerById(99L)).thenThrow(new NoSuchElementException("not found"));

        mockMvc.perform(get("/api/v1/customer/99").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void businessErrorShouldMatchContract() throws Exception {
        when(customerService.getCustomerById(5L)).thenThrow(new BusinessException("regra violada"));

        mockMvc.perform(get("/api/v1/customer/5").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getCustomerOrdersShouldMatchContract() throws Exception {
        OrderDto order = new OrderDto();
        order.setId(1L);
        order.setCustomerId(2L);
        order.setTotalPrice(50.0);
        List<OrderDto> orders = List.of(order);
        when(orderClient.findOrdersByCustomerId(2L)).thenReturn(orders);

        mockMvc.perform(get("/api/v1/customer/2/orders").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void checkCustomerExistsShouldMatchContract() throws Exception {
        when(customerService.getCustomerById(3L)).thenReturn(CustomerDto.builder().id(3L).build());

        mockMvc.perform(get("/api/v1/customer/3/exists").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getCustomerByEmailShouldMatchContract() throws Exception {
        CustomerDto customer = CustomerDto.builder().id(1L).email("leo@test.com").build();
        when(customerService.validateCustomerEmail("leo@test.com")).thenReturn(true);
        when(customerService.getCustomerByEmail("leo@test.com")).thenReturn(customer);

        mockMvc.perform(get("/api/v1/customer/email/leo@test.com").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void getCustomerByEmailNotFoundShouldMatchContract() throws Exception {
        when(customerService.validateCustomerEmail("bad")).thenReturn(false);

        mockMvc.perform(get("/api/v1/customer/email/bad").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void searchCustomersByNameShouldMatchContract() throws Exception {
        List<CustomerDto> result = List.of(CustomerDto.builder().id(1L).name("Ana").build());
        when(customerService.getCustomersByName("Ana")).thenReturn(result);

        mockMvc.perform(get("/api/v1/customer/search")
                        .param("name", "Ana")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void createCustomerShouldMatchContract() throws Exception {
        CustomerDto request = CustomerDto.builder().name("Ana").email("ana@test.com").build();

        mockMvc.perform(post("/api/v1/customer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isAccepted())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void updateCustomerShouldMatchContract() throws Exception {
        CustomerDto request = CustomerDto.builder().id(1L).name("Ana Updated").email("ana@test.com").build();
        when(customerService.updateCustomer(any())).thenReturn(request);

        mockMvc.perform(put("/api/v1/customer/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void deleteCustomerShouldMatchContract() throws Exception {
        mockMvc.perform(delete("/api/v1/customer/1"))
                .andExpect(status().isAccepted())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void validateEmailOkShouldMatchContract() throws Exception {
        when(customerService.validateCustomerEmail("ok@test.com")).thenReturn(true);

        mockMvc.perform(post("/api/v1/customer/validate-email")
                        .param("email", "ok@test.com"))
                .andExpect(status().isOk())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }

    @Test
    void validateEmailBadRequestShouldMatchContract() throws Exception {
        when(customerService.validateCustomerEmail("bad")).thenReturn(false);

        mockMvc.perform(post("/api/v1/customer/validate-email")
                        .param("email", "bad"))
                .andExpect(status().isBadRequest())
                .andExpect(openApi().isValid(OPEN_API_SPEC));
    }
}

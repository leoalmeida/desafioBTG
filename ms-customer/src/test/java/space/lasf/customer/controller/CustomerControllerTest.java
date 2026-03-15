package space.lasf.customer.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import space.lasf.customer.dto.CustomerDto;
import space.lasf.customer.event.CustomerRabbitProducer;
import space.lasf.customer.service.CustomerService;

class CustomerControllerTest {

    private MockMvc mockMvc;

    private CustomerService customerService;

    private CustomerRabbitProducer producer;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        customerService = mock(CustomerService.class);
        producer = mock(CustomerRabbitProducer.class);

        CustomerController controller = new CustomerController();
        ReflectionTestUtils.setField(controller, "customerService", customerService);
        ReflectionTestUtils.setField(controller, "producer", producer);

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void getAllCustomersShouldReturnOk() throws Exception {
        List<CustomerDto> customers = List.of(
                CustomerDto.builder().id(1L).name("Ana").email("ana@test.com").build());
        when(customerService.getAllCustomers()).thenReturn(customers);

        mockMvc.perform(get("/api/v1/customer"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Ana"));

        verify(customerService).getAllCustomers();
    }

    @Test
    void getCustomerByIdShouldReturnOk() throws Exception {
        CustomerDto customer =
                CustomerDto.builder().id(2L).name("Leo").email("leo@test.com").build();
        when(customerService.getCustomerById(2L)).thenReturn(customer);

        mockMvc.perform(get("/api/v1/customer/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.email").value("leo@test.com"));

        verify(customerService).getCustomerById(2L);
    }

    @Test
    void checkCustomerExistsShouldReturnTrue() throws Exception {
        when(customerService.getCustomerById(3L))
                .thenReturn(CustomerDto.builder().id(3L).build());

        mockMvc.perform(get("/api/v1/customer/3/exists"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(customerService).getCustomerById(3L);
    }

    @Test
    void getCustomerByEmailShouldReturnNotFoundWhenInvalidEmail() throws Exception {
        when(customerService.validateCustomerEmail("invalid")).thenReturn(false);

        mockMvc.perform(get("/api/v1/customer/email/invalid")).andExpect(status().isNotFound());

        verify(customerService).validateCustomerEmail("invalid");
    }

    @Test
    void getCustomerByEmailShouldReturnOkWhenValid() throws Exception {
        CustomerDto customer =
                CustomerDto.builder().id(4L).email("ok@test.com").name("Ok").build();
        when(customerService.validateCustomerEmail("ok@test.com")).thenReturn(true);
        when(customerService.getCustomerByEmail("ok@test.com")).thenReturn(customer);

        mockMvc.perform(get("/api/v1/customer/email/ok@test.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4));

        verify(customerService).validateCustomerEmail("ok@test.com");
        verify(customerService).getCustomerByEmail("ok@test.com");
    }

    @Test
    void searchCustomersByNameShouldReturnOk() throws Exception {
        when(customerService.getCustomersByName("ana"))
                .thenReturn(List.of(CustomerDto.builder().id(1L).name("Ana").build()));

        mockMvc.perform(get("/api/v1/customer/search").param("name", "ana"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Ana"));

        verify(customerService).getCustomersByName("ana");
    }

    @Test
    void createCustomerShouldReturnAccepted() throws Exception {
        CustomerDto payload = CustomerDto.builder()
                .name("New")
                .email("new@test.com")
                .phone("119999")
                .build();

        mockMvc.perform(post("/api/v1/customer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isAccepted());

        verify(producer).publishCustomerCreated(any(CustomerDto.class));
    }

    @Test
    void updateCustomerShouldReturnOk() throws Exception {
        CustomerDto payload =
                CustomerDto.builder().id(9L).name("Upd").email("upd@test.com").build();
        when(customerService.updateCustomer(any(CustomerDto.class))).thenReturn(payload);

        mockMvc.perform(put("/api/v1/customer/9")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(9));

        verify(customerService).updateCustomer(any(CustomerDto.class));
    }

    @Test
    void deleteCustomerShouldReturnAccepted() throws Exception {
        mockMvc.perform(delete("/api/v1/customer/10")).andExpect(status().isAccepted());

        verify(producer).publishCustomerDeleted(10L);
    }

    @Test
    void validateEmailShouldReturnOkWhenValid() throws Exception {
        when(customerService.validateCustomerEmail("ok@test.com")).thenReturn(true);

        mockMvc.perform(post("/api/v1/customer/validate-email").param("email", "ok@test.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(customerService).validateCustomerEmail("ok@test.com");
    }

    @Test
    void validateEmailShouldReturnBadRequestWhenInvalid() throws Exception {
        when(customerService.validateCustomerEmail("bad")).thenReturn(false);

        mockMvc.perform(post("/api/v1/customer/validate-email").param("email", "bad"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("false"));

        verify(customerService).validateCustomerEmail("bad");
    }
}

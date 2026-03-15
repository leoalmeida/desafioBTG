package space.lasf.customer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EnableFeignClients
public class MsCustomerApplication {

    public static void main(final String[] args) {
        SpringApplication.run(MsCustomerApplication.class, args);
    }
}

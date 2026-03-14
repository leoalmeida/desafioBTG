FROM maven:3.8.5-openjdk-17-slim

ADD . /usr/src/ms-customer
WORKDIR /usr/src/ms-customer
EXPOSE 8081
ENTRYPOINT ["mvn", "clean", "install", "spring-boot:run"]

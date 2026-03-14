FROM maven:3.8.5-openjdk-17-slim

ADD . /usr/src/ms-order
WORKDIR /usr/src/ms-order
EXPOSE 8081
ENTRYPOINT ["mvn", "clean", "install", "spring-boot:run"]

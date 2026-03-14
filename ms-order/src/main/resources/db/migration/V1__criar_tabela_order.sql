CREATE TABLE ORDERS(
    id BIGINT(20) NOT NULL auto_increment,
    customer_id BIGINT(20) NULL,
    total_price DOUBLE NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
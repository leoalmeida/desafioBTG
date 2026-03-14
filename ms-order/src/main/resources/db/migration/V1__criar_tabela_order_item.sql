CREATE TABLE ORDER_ITEMS(
    id BIGINT(20) NOT NULL auto_increment,
    order_id BIGINT(20) NOT NULL,
    product_name VARCHAR(255) NULL,
    quantity INT(11) NULL,
    price DECIMAL(10,2) NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
import { CustomerType } from "../app/customers/customer-type";
import { OrderItemType, OrderType } from "../app/orders/order-type";
import { UserType } from "../app/users/user-type";

export function makeCustomer(
  overrides: Partial<CustomerType> = {},
): CustomerType {
  return {
    id: 1,
    name: "Cliente Teste",
    email: "cliente@example.com",
    phone: "11999999999",
    ativo: true,
    ...overrides,
  };
}

export function makeOrderItem(
  overrides: Partial<OrderItemType> = {},
): OrderItemType {
  return {
    id: 1,
    productName: "Produto Teste",
    quantity: 1,
    price: 10,
    ...overrides,
  };
}

export function makeOrder(overrides: Partial<OrderType> = {}): OrderType {
  return {
    id: 1,
    customerId: 1,
    totalPrice: 10,
    itemList: [makeOrderItem()],
    ...overrides,
  };
}

export function makeUser(overrides: Partial<UserType> = {}): UserType {
  return {
    id: 1,
    email: "user@test.com",
    nome: "Usuario Teste",
    telefone: "11999990000",
    username: "user",
    stats: [],
    logs: [],
    ...overrides,
  };
}

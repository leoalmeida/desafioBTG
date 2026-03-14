export interface OrderType {
  id: number;
  customerId: number;
  totalPrice: number;
  itemList: OrderItemType[];
}

export interface OrderItemType {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}
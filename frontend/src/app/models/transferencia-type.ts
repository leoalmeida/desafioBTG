/**
 * Interface para transferência de valor entre benefícios. Contém os IDs dos benefícios de origem e destino, e o valor a ser transferido.
 */
export interface TransferenciaType {
  fromId: number;
  toId: number;
  valor: number;
}

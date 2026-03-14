export interface CustomerType {
  id: number | -1;
  name: string;
  email: string;
  phone: string;
  ativo: boolean;
  version?: number;
}

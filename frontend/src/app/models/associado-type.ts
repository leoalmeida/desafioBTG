import { TokenType } from './token-type';

export interface AssociadoType {
  id: number;
  email: string;
  nome: string;
  telefone: string;
  username: string;
  userData?: TokenType;
  accessToken?: string;
  stats: { title: string; value: number }[];
  logs: string[];
}

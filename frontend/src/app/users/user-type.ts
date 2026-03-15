import { TokenType } from "../login/token-type";

export interface UserType {
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

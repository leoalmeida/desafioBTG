import { Injectable } from "@angular/core";

@Injectable()
export class TokenType {
  id = 0;
  sub = "";
  username = "";
  roles: string[] = [];
  permissions: string[] = [];
  iat = 123;
  exp = 456;
}

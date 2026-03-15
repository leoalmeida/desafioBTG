import { Injectable } from "@angular/core";

import { TokenType } from "./token-type";

@Injectable()
export class PermissionService {
  canActivate(currentUser: TokenType, userId: number, role: string): boolean {
    return currentUser.id === userId && currentUser.roles.includes(role);
  }
  canMatch(currentUser: TokenType, role: string): boolean {
    return currentUser.roles.includes(role);
  }
}

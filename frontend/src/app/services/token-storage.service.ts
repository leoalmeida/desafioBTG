import { Injectable, signal } from '@angular/core';
import { AssociadoType } from '../models/associado-type';
import { BehaviorSubject } from 'rxjs';
import { TokenType } from '../models/token-type';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private associado = new BehaviorSubject<AssociadoType>({} as AssociadoType);
  private autenticado = new BehaviorSubject<boolean>(false);
  private loggedIn = signal<boolean>(false);

  constructor() {}

  isAuthenticated = this.loggedIn.asReadonly();
  loggedUser = this.associado.getValue();
  loggedUser$ = this.associado.asObservable();
  autenticado$ = this.autenticado.asObservable();

  signOut(): void {
    window.sessionStorage.clear();
    this.associado.next({} as AssociadoType);
    this.autenticado.next(false);
    this.loggedIn.set(false);
  }

  public saveJsonWebToken(accessToken: AssociadoType): void {
    if (accessToken.accessToken) {
      const userToken: TokenType = JSON.parse(
        atob(accessToken.accessToken.split('.')[1]),
      );

      const associado: AssociadoType = {
        id: userToken.id,
        nome: accessToken.nome,
        email: accessToken.email,
        telefone: accessToken.telefone,
        username: userToken.username,
        userData: userToken,
        accessToken: accessToken.accessToken,
        stats: [],
        logs: [],
      };

      this.saveUser(associado);

      this.associado.next(associado);
      this.autenticado.next(true);
      this.loggedIn.set(true);
    }
  }
  public hasRole(role: string): boolean {
    return this.associado.getValue().userData?.roles.includes(role) || false;
  }

  public saveUser(user: AssociadoType): void {
    window.sessionStorage.removeItem('user'); // Clear previous user
    window.sessionStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(): AssociadoType {
    const user = window.sessionStorage.getItem('user');
    return user ? JSON.parse(user) : ({} as AssociadoType);
  }
}

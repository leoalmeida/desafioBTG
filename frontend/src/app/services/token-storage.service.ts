import { Injectable, signal } from "@angular/core";
import { UserType } from "../users/user-type";
import { BehaviorSubject } from "rxjs";
import { TokenType } from "../login/token-type";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  private associado = new BehaviorSubject<UserType>({} as UserType);
  private autenticado = new BehaviorSubject<boolean>(false);
  private loggedIn = signal<boolean>(false);

  constructor() {}

  isAuthenticated = this.loggedIn.asReadonly();
  loggedUser = this.associado.getValue();
  loggedUser$ = this.associado.asObservable();
  autenticado$ = this.autenticado.asObservable();

  signOut(): void {
    window.sessionStorage.clear();
    this.associado.next({} as UserType);
    this.autenticado.next(false);
    this.loggedIn.set(false);
  }

  public saveJsonWebToken(accessToken: UserType): void {
    if (accessToken.accessToken) {
      const userToken: TokenType = JSON.parse(
        atob(accessToken.accessToken.split(".")[1]),
      );

      const associado: UserType = {
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

  public saveUser(user: UserType): void {
    window.sessionStorage.removeItem("user"); // Clear previous user
    window.sessionStorage.setItem("user", JSON.stringify(user));
  }

  public getUser(): UserType {
    const user = window.sessionStorage.getItem("user");
    return user ? JSON.parse(user) : ({} as UserType);
  }
}

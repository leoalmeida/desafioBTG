import { associados } from './../../mocks/associados';
import { AssociadoType } from 'src/app/models/associado-type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = '';
  private http: HttpClient = inject(HttpClient);
  private apiData = [...associados];
  private associadoList = signal<AssociadoType[]>([]);
  private loggedUser = new BehaviorSubject<AssociadoType>({} as AssociadoType);

  private tokenStorageService = inject(TokenStorageService);

  private mockHttpCall = <T>(result: T) => {
    return new Observable<T>((s) => {
      s.next(result);
      s.complete();
    });
  };

  loggedUser$ = this.loggedUser.asObservable();
  items = this.associadoList.asReadonly();

  constructor() {
    this.baseUrl = environment.authApi || '/api/v1/auth'; // Default to a fallback URL if not define
    this.mockHttpCall<any>(this.apiData).subscribe((xs) =>
      this.associadoList.set(xs),
    );
  }

  login(username: string, password: string): Observable<AssociadoType> {
    void password;
    //return this.http.post<any>(`${this.baseUrl}/signin`, { username, password }, httpOptions);
    const user = this.associadoList().find(
      (user) => user.username === username,
    );
    if (user) {
      this.mockHttpCall<AssociadoType>(user).subscribe(
        (logged: AssociadoType) => {
          this.loggedUser.next(logged);
          this.tokenStorageService.saveJsonWebToken(logged);
        },
      );
      return this.loggedUser.asObservable();
    } else {
      return new Observable<AssociadoType>((s) => {
        s.error(new Error('Usuário ou senha inválidos'));
        s.complete();
      });
    }
  }

  logout(): void {
    //this.http.post<any>(`${this.baseUrl}/signout`, { }, httpOptions).subscribe();
    this.tokenStorageService.signOut();
  }

  register(
    username: string,
    nome: string,
    email: string,
    telefone: string,
    password: string,
  ): Observable<AssociadoType> {
    //return this.http.post<any>(`${this.baseUrl}/signup`, { username, email, password }, httpOptions);
    const createdUser: AssociadoType = {
      id: Number(password),
      email: email,
      nome: nome,
      username: username,
      telefone: telefone, // Placeholder, as telefone is not provided in the mock
      accessToken: 'abc123',
      stats: [],
      logs: [],
    };
    this.apiData.push(createdUser);
    return this.mockHttpCall<AssociadoType>(createdUser);
  }
}

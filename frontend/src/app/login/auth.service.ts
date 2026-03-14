import { UserType } from 'src/app/users/user-type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

const users: UserType[] = [
  {
    id: 1,
    email: 'jrrtolk@teste.com',
    nome: 'J.R.R. Tolkien',
    telefone: '99999',
    username: 'jrrtolk',
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3ViIjoiMzIzMjEyMTIxIiwidXNlcm5hbWUiOiJqcnJ0b2xrIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sInBlcm1pc3Npb25zIjpbIlJFQUQiLCJXUklURSJdLCJleHAiOjF9.8sJuOv7jrls5DJOIR2ReuKoBHpl8ffvD1gTYbJEv30Q',
    stats: [
      { title: 'Benefícios Ativos', value: 5 },
      { title: 'Benefícios Cancelados', value: 2 },
      { title: 'Benefícios Pendentes', value: 1 },
    ],
    logs: [
      'Usuário jrrtolk fez login.',
      "Usuário jrrtolk visualizou o benefício 'Plano de Saúde'.",
    ],
  },
  {
    id: 5,
    email: 'teste1@teste.com',
    nome: 'Teste Gibson',
    telefone: '333333',
    username: 'teste',
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IldpbGxpYW0gR2lic29uIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiaWQiOjQsInVzZXJuYW1lIjoid2lsbGlhbkB0ZXN0ZS5jb20iLCJyb2xlcyI6WyJVU0VSIl0sInBlcm1pc3Npb25zIjpbIkZVTEwiXX0.5tPzsrO8KeIljFC64tItjIa1EasQlb5lwtmAnu4esCc',
    stats: [
      { title: 'Benefícios Ativos', value: 2 },
      { title: 'Benefícios Cancelados', value: 3 },
      { title: 'Benefícios Pendentes', value: 0 },
    ],
    logs: [
      'Usuário william fez login.',
      "Usuário william visualizou o benefício 'Plano de Saúde'.",
    ],
  }
];


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = '';
  private http: HttpClient = inject(HttpClient);
  private apiData = [...users];
  private userList = signal<UserType[]>([]);
  private loggedUser = new BehaviorSubject<UserType>({} as UserType);

  private tokenStorageService = inject(TokenStorageService);

  private mockHttpCall = <T>(result: T) => {
    return new Observable<T>((s) => {
      s.next(result);
      s.complete();
    });
  };

  loggedUser$ = this.loggedUser.asObservable();
  items = this.userList.asReadonly();

  constructor() {
    this.baseUrl = environment.authApi || '/api/v1/auth'; // Default to a fallback URL if not define
    this.mockHttpCall<any>(this.apiData).subscribe((xs) =>
      this.userList.set(xs),
    );
  }

  login(username: string, password: string): Observable<UserType> {
    void password;
    //return this.http.post<any>(`${this.baseUrl}/signin`, { username, password }, httpOptions);
    const user = this.userList().find(
      (user) => user.username === username,
    );
    if (user) {
      this.mockHttpCall<UserType>(user).subscribe(
        (logged: UserType) => {
          this.loggedUser.next(logged);
          this.tokenStorageService.saveJsonWebToken(logged);
        },
      );
      return this.loggedUser.asObservable();
    } else {
      return new Observable<UserType>((s) => {
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
  ): Observable<UserType> {
    //return this.http.post<any>(`${this.baseUrl}/signup`, { username, email, password }, httpOptions);
    const createdUser: UserType = {
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
    return this.mockHttpCall<UserType>(createdUser);
  }
}

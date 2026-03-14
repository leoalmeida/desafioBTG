import { UserType } from 'src/app/users/user-type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

const users: UserType[] = [
  {
    id: 1,
    username: 'jrrtolk',
    nome: 'Jorge',
    email: 'jorge@test.com',
    telefone: '11999990000',
    stats: [],
    logs: [],
  },
  {
    id: 2,
    username: 'teste',
    nome: 'Maria',
    email: 'maria@test.com',
    telefone: '11888887777',
    stats: [],
    logs: [],
  },
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

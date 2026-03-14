import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { BeneficioType } from '../models/beneficio-type';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class BeneficioService {
  private baseUrl = '/api/v1/beneficios';
  private beneficiosList = signal<BeneficioType[]>([]);

  private http: HttpClient = inject(HttpClient);
  private notify = inject(NotificationService);
  constructor() {
    this.baseUrl = environment.beneficiosApi;
  }

  items = this.beneficiosList.asReadonly();

  getAll(): void {
    this.http.get<BeneficioType[]>(`${this.baseUrl}`).subscribe({
      next: (lista: BeneficioType[]) => {
        this.notify.showSuccess(
          `Benefícios carregados com sucesso. Total de benefícios: ${lista.length}.`,
        );
        this.beneficiosList.set(lista);
        return true;
      },
      error: (error) => this.handleError(error),
    });
  }
  getAllAndReturn(): Observable<boolean> {
    return this.http.get<BeneficioType[]>(`${this.baseUrl}`).pipe(
      map((lista: BeneficioType[]) => {
        this.notify.showSuccess(
          `Benefícios carregados com sucesso. Total de benefícios: ${lista.length}.`,
        );
        this.beneficiosList.set(lista);
        return true;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  getOne(idAssociado: number): Observable<BeneficioType> {
    return this.http
      .get<BeneficioType>(`${this.baseUrl}/associado/${idAssociado}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAllAtivos(): Observable<BeneficioType[]> {
    return this.http
      .get<BeneficioType[]>(`${this.baseUrl}/ativos`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  //POST - "/"
  createOne(beneficio: BeneficioType): Observable<boolean> {
    this.notify.showSuccess(
      `Solicitando a criação de novo benefício: nome: ${beneficio.nome}.`,
    );
    return this.http.post<BeneficioType>(`${this.baseUrl}`, beneficio).pipe(
      map((added) => {
        if (!added) return false;
        const lista = this.beneficiosList();
        lista.push(added); // Adiciona o novo item à lista
        this.beneficiosList.set([...lista]); // Atualiza a signal para refletir as mudanças
        return true;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  changeOne(beneficio: BeneficioType): Observable<boolean> {
    return this.http
      .put<BeneficioType>(`${this.baseUrl}/${beneficio.id}`, beneficio)
      .pipe(
        map((beneficio) => {
          if (!beneficio) return false;
          const lista = this.beneficiosList();
          const changed = lista.find((x) => x.id === beneficio.id);
          if (changed) {
            Object.assign(changed, beneficio); // Atualiza o item na lista com os novos dados
            this.beneficiosList.set([...lista]); // Atualiza a signal para refletir as mudanças
          }
          this.notify.showSuccess(
            `Benefício atualizado com sucesso: nome: ${beneficio.nome}.`,
          );
          return true;
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  changeStatus(beneficio: BeneficioType): void {
    this.http
      .put<BeneficioType>(
        `${this.baseUrl}/${beneficio.id}/${beneficio.ativo ? 'ativar' : 'cancelar'}`,
        {},
      )
      .subscribe({
        next: (beneficio) => {
          if (!beneficio) return false;
          const lista = this.beneficiosList();
          const changed = lista.find((x) => x.id === beneficio.id);
          if (changed) {
            Object.assign(changed, beneficio); // Atualiza o item na lista com os novos dados
            this.beneficiosList.set([...lista]); // Atualiza a signal para refletir as mudanças
          }
          this.notify.showSuccess(
            `Benefício ${beneficio.ativo ? 'ativado' : 'cancelado'} com sucesso: nome: ${beneficio.nome}.`,
          );
          return true;
        },
        error: (error) => this.handleError(error),
      });
  }

  removerBeneficio(idBeneficio: number): void {
    this.http.delete<void>(`${this.baseUrl}/${idBeneficio}`).pipe(
      map(this.getAllAndReturn),
      catchError((error) => this.handleError(error)),
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    }
    if (error.error instanceof ProgressEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error}`;
    } else {
      // Erro do lado do servidor
      errorMessage =
        error.error?.message || `Erro ${error.status}: ${error.statusText}`;
    }

    this.notify.showError(`Erro na requisição: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}

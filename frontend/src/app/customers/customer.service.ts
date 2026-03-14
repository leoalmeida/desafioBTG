import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomerType } from './customer-type';
import { NotificationService } from '../services/notification.service';
import { OrderType } from '../orders/order-type';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = '/api/v1/customer';
  private customersList = signal<CustomerType[]>([]);

  private http: HttpClient = inject(HttpClient);
  private notify = inject(NotificationService);
  constructor() {
    this.baseUrl = environment.customersApi;
  }

  items = this.customersList.asReadonly();

  getAll(): void {
    this.http.get<CustomerType[]>(`${this.baseUrl}`).subscribe({
      next: (lista: CustomerType[]) => {
        this.notify.showSuccess(
          `Clientes carregados com sucesso. Total de clientes: ${lista.length}.`,
        );
        this.customersList.set(lista);
        return true;
      },
      error: (error) => this.handleError(error),
    });
  }
  getAllAndReturn(): Observable<boolean> {
    return this.http.get<CustomerType[]>(`${this.baseUrl}`).pipe(
      map((lista: CustomerType[]) => {
        this.notify.showSuccess(
          `Clientes carregados com sucesso. Total de clientes: ${lista.length}.`,
        );
        this.customersList.set(lista);
        return true;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  getOne(idCustomer: number): Observable<CustomerType> {
    return this.http
      .get<CustomerType>(`${this.baseUrl}/${idCustomer}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getCustomerOrders(idCustomer: number): Observable<OrderType[]> {
    return this.http
      .get<OrderType[]>(`${this.baseUrl}/${idCustomer}/orders`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  //POST - "/"
  createOne(customer: CustomerType): Observable<boolean> {
    this.notify.showSuccess(
      `Solicitando a criação de novo cliente: nome: ${customer.name}.`,
    );
    return this.http.post<CustomerType>(`${this.baseUrl}`, customer).pipe(
      map((added) => {
        if (!added) return false;
        const lista = this.customersList();
        lista.push(added); // Adiciona o novo item à lista
        this.customersList.set([...lista]); // Atualiza a signal para refletir as mudanças
        return true;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  //PUT - "/{id}"
  changeOne(customer: CustomerType): Observable<boolean> {
    return this.http
      .put<CustomerType>(`${this.baseUrl}/${customer.id}`, customer)
      .pipe(
        map((customer) => {
          if (!customer) return false;
          const lista = this.customersList();
          const changed = lista.find((x) => x.id === customer.id);
          if (changed) {
            Object.assign(changed, customer); // Atualiza o item na lista com os novos dados
            this.customersList.set([...lista]); // Atualiza a signal para refletir as mudanças
          }
          this.notify.showSuccess(
            `Cliente atualizado com sucesso: nome: ${customer.name}.`,
          );
          return true;
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  //DELETE - "/{id}
  removerCustomer(idCustomer: number): void {
    this.http
      .delete<void>(
        `${this.baseUrl}/${idCustomer}`,
        {},
      )
      .subscribe({
        next: () => {
          const lista = this.customersList();
          const removed = lista.findIndex((x) => x.id === idCustomer)
          if (removed > -1) {
            lista.splice(removed, 1);
            this.customersList.set([...lista]); // Atualiza a signal para refletir as mudanças
          
            this.notify.showSuccess(
              `Cliente removido com sucesso.`,
            );
            return true
          }
          return false;
        },
        error: (error) => this.handleError(error),
      });
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

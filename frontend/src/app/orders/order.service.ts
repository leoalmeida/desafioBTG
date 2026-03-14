import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderType } from './order-type';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = '/api/v1/orders';
  private ordersList = signal<OrderType[]>([]);
  private fullList = signal<OrderType[]>([]);

  private http: HttpClient = inject(HttpClient);
  private notify = inject(NotificationService);

  constructor() {
    this.baseUrl = environment.ordersApi;
    this.getAll();
  }

  items = this.ordersList.asReadonly();

  addOne(customerId: number): void {
    const addedOrder: OrderType = {
      id: this.ordersList().length > 0 ? Math.min(...this.ordersList().map(o => o.id)) - 1 : -1  ,
      customerId: customerId,
      totalPrice: 0.00,
      itemList: [],
    };
    const lista = this.ordersList();
    lista.push(addedOrder);
    this.ordersList.set([...lista]); // Atualiza a signal para refletir as mudanças
  }
  removeOne(orderId: number): void {
    if (orderId >= 0) {
      this.removeOrder(orderId);
      return;
    }
    const lista = this.ordersList();
    const removed = lista.findIndex((x) => x.id === orderId);
    if (removed > -1) {
      lista.splice(removed, 1);
      this.ordersList.set([...lista]); // Atualiza a signal para refletir as mudanças
    }
  }

  filterByCustomer(customerId: number): void {
    if (customerId >= 0) {
      const filtered = this.fullList().filter((o) => o.customerId === customerId);
      this.ordersList.set(filtered);
    }else{
      this.ordersList.set(this.fullList());
    }
  }

  getAll(): void {
    this.http.get<OrderType[]>(`${this.baseUrl}`).subscribe({
      next: (lista: OrderType[]) => {
        this.notify.showSuccess(
          `Pedidos carregados com sucesso. Total de pedidos: ${lista.length}.`,
        );
        this.fullList.set(lista);
        return true;
      },
      error: (error) => this.handleError(error),
    });
  }
  
  getAllAndReturn(): Observable<boolean> {
    return this.http.get<OrderType[]>(`${this.baseUrl}`).pipe(
      map((lista: OrderType[]) => {
        this.notify.showSuccess(
          `Pedidos carregados com sucesso. Total de pedidos: ${lista.length}.`,
        );
        this.ordersList.set(lista);
        return true;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  getOne(idAssociado: number): Observable<OrderType> {
    return this.http
      .get<OrderType>(`${this.baseUrl}/associado/${idAssociado}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  //POST - "/"
  createOne(order: OrderType): Observable<boolean> {
    this.notify.showSuccess(
      `Solicitando a criação de novo pedido: ID: ${order.id}.`,
    );
    return this.http.post<OrderType>(`${this.baseUrl}`, order).pipe(
      map((added) => {
        if (!added) return false;
        const lista = this.ordersList();
        lista.push(added); // Adiciona o novo item à lista
        this.ordersList.set([...lista]); // Atualiza a signal para refletir as mudanças
        return true;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  //PUT - "/{id}"
  changeOne(order: OrderType): Observable<boolean> {
    return this.http
      .put<OrderType>(`${this.baseUrl}/${order.id}`, order)
      .pipe(
        map((order) => {
          if (!order) return false;
          const lista = this.ordersList();
          const changed = lista.find((x) => x.id === order.id);
          if (changed) {
            Object.assign(changed, order); // Atualiza o item na lista com os novos dados
            this.ordersList.set([...lista]); // Atualiza a signal para refletir as mudanças
          }
          this.notify.showSuccess(
            `Pedido atualizado com sucesso: ID: ${order.id}.`,
          );
          return true;
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  //DELETE - "/{id}"
  removeOrder(orderId: number): void {
    this.http.delete<void>(
        `${this.baseUrl}/${orderId}`,{},)
      .subscribe({
        next: () => {
          const lista = this.ordersList();
          const changed = lista.findIndex((x) => x.id === orderId);
          if (changed > -1) {
            lista.splice(changed, 1);
            this.ordersList.set([...lista]); // Atualiza a signal para refletir as mudanças
          }
          this.notify.showSuccess(
            `Pedido removido com sucesso.`,
          );
          return true;
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

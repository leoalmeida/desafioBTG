import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { BeneficioType } from '../models/beneficio-type';
import { TransferenciaType } from '../models/transferencia-type';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class TransferenciaService {
  private baseUrl = '/api/v1/beneficios';
  private beneficiosList = signal<BeneficioType[]>([]);

  private logger = inject(LoggerService);

  private http: HttpClient = inject(HttpClient);
  constructor() {
    this.baseUrl = environment.beneficiosApi + '/transferir';
  }

  items = this.beneficiosList.asReadonly();

  transferValue(transferencia: TransferenciaType): Observable<boolean> {
    this.logger.log(
      `Transferindo valor ${transferencia.valor} de benefício: ${transferencia.fromId} para benefício: ${transferencia.toId}.`,
    );
    return this.http.post<any>(`${this.baseUrl}`, transferencia).pipe(
      map((value) => (value ? true : false)),
      catchError((error) => this.handleError(error)),
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage =
        error.error?.message || `Erro ${error.status}: ${error.statusText}`;
    }

    this.logger.error(`Erro na requisição: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}

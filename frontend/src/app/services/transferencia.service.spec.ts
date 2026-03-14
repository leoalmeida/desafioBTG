import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TransferenciaService } from './transferencia.service';
import { LoggerService } from './logger.service';
import { TransferenciaType } from '../models/transferencia-type';
import { environment } from '../../environments/environment';
import { createSpyObj, SpyObj } from '../../test-helpers/spy-utils';

describe('TransferenciaService', () => {
  let service: TransferenciaService;
  let httpMock: HttpTestingController;
  let loggerSpy: SpyObj<LoggerService>;

  const mockTransferencia: TransferenciaType = {
    fromId: 1,
    toId: 2,
    valor: 100.5,
  };

  beforeEach(() => {
    const spy = createSpyObj<LoggerService>(['log', 'error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TransferenciaService,
        { provide: LoggerService, useValue: spy },
      ],
    });
    service = TestBed.inject(TransferenciaService);
    httpMock = TestBed.inject(HttpTestingController);
    loggerSpy = TestBed.inject(LoggerService) as unknown as typeof loggerSpy;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar uma transferência com sucesso (transferValue)', () => {
    service.transferValue(mockTransferencia).subscribe((res) => {
      expect(res).toBe(false);
    });

    const req = httpMock.expectOne(`${environment.beneficiosApi}/transferir`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockTransferencia);

    req.flush(null);
    expect(loggerSpy.log).toHaveBeenCalledWith(
      expect.stringMatching(
        /Transferindo valor 100.5 de benefício: 1 para benefício: 2/,
      ),
    );
  });

  it('deve lidar com erro do servidor na transferência', () => {
    const errorMsg = 'Saldo insuficiente';

    service.transferValue(mockTransferencia).subscribe({
      next: () => {
        throw new Error('Deveria ter falhado');
      },
      error: (error) => {
        expect(error.message).toContain(errorMsg);
      },
    });

    const req = httpMock.expectOne(`${environment.beneficiosApi}/transferir`);
    req.flush(
      { message: errorMsg },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(loggerSpy.error).toHaveBeenCalledWith(
      expect.stringMatching(/Erro na requisição:.*Saldo insuficiente/),
    );
  });
});

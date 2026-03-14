import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { OrderType } from './order-type';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  let notificationSpy: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockOrder: OrderType = {
    id: 1,
    nome: 'Vale Refeicao',
    descricao: 'VR',
    valor: 100,
    ativo: true,
  };

  beforeEach(() => {
    notificationSpy = { showSuccess: vi.fn(), showError: vi.fn() };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrderService,
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar todos os orders (getAll) e atualizar a signal', () => {
    const mockList = [mockOrder];

    service.getAll();

    const req = httpMock.expectOne(environment.ordersApi);
    expect(req.request.method).toBe('GET');
    req.flush(mockList);

    expect(service.items()).toEqual(mockList);
    expect(notificationSpy.showSuccess).toHaveBeenCalled();
  });

  it('deve buscar todos os orders com retorno booleano (getAllAndReturn)', async () => {
    const resultPromise = firstValueFrom(service.getAllAndReturn());

    const req = httpMock.expectOne(environment.ordersApi);
    expect(req.request.method).toBe('GET');
    req.flush([mockOrder]);

    const result = await resultPromise;
    expect(result).toBe(true);
    expect(service.items().length).toBe(1);
  });

  it('deve criar um novo order (createOne)', async () => {
    const resultPromise = firstValueFrom(service.createOne(mockOrder));

    const req = httpMock.expectOne(environment.ordersApi);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockOrder);
    req.flush(mockOrder);

    const result = await resultPromise;
    expect(result).toBe(true);
    expect(service.items().length).toBe(1);
  });

  it('deve atualizar um order existente (changeOne)', async () => {
    (service as any).ordersList.set([mockOrder]);
    const updated = { ...mockOrder, nome: 'VR Atualizado' };

    const resultPromise = firstValueFrom(service.changeOne(updated));

    const req = httpMock.expectOne(
      `${environment.ordersApi}/${mockOrder.id}`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(updated);

    const result = await resultPromise;
    expect(result).toBe(true);
    expect(service.items()[0].nome).toBe('VR Atualizado');
  });

  it('deve chamar endpoint ativar quando ativo for true', () => {
    service.changeStatus(mockOrder);

    const req = httpMock.expectOne(
      `${environment.ordersApi}/${mockOrder.id}/ativar`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(mockOrder);
  });

  it('deve chamar endpoint cancelar quando ativo for false', () => {
    const inativo = { ...mockOrder, ativo: false };

    service.changeStatus(inativo);

    const req = httpMock.expectOne(
      `${environment.ordersApi}/${inativo.id}/cancelar`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(inativo);
  });

  it('deve propagar erro em getOne', async () => {
    const errorPromise = firstValueFrom(service.getOne(99)).catch((err) => err);

    const req = httpMock.expectOne(`${environment.ordersApi}/associado/99`);
    expect(req.request.method).toBe('GET');
    req.flush(
      { message: 'Erro interno' },
      { status: 500, statusText: 'Server Error' },
    );

    const err = (await errorPromise) as Error;
    expect(err.message).toContain('Erro interno');
    expect(notificationSpy.showError).toHaveBeenCalled();
  });
});

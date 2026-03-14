import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BeneficioService } from './beneficio.service';
import { BeneficioType } from '../models/beneficio-type';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

describe('BeneficioService', () => {
  let service: BeneficioService;
  let httpMock: HttpTestingController;
  let notificationSpy: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockBeneficio: BeneficioType = {
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
        BeneficioService,
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    service = TestBed.inject(BeneficioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar todos os beneficios (getAll) e atualizar a signal', () => {
    const mockList = [mockBeneficio];

    service.getAll();

    const req = httpMock.expectOne(environment.beneficiosApi);
    expect(req.request.method).toBe('GET');
    req.flush(mockList);

    expect(service.items()).toEqual(mockList);
    expect(notificationSpy.showSuccess).toHaveBeenCalled();
  });

  it('deve buscar todos os beneficios com retorno booleano (getAllAndReturn)', async () => {
    const resultPromise = firstValueFrom(service.getAllAndReturn());

    const req = httpMock.expectOne(environment.beneficiosApi);
    expect(req.request.method).toBe('GET');
    req.flush([mockBeneficio]);

    const result = await resultPromise;
    expect(result).toBe(true);
    expect(service.items().length).toBe(1);
  });

  it('deve criar um novo beneficio (createOne)', async () => {
    const resultPromise = firstValueFrom(service.createOne(mockBeneficio));

    const req = httpMock.expectOne(environment.beneficiosApi);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockBeneficio);
    req.flush(mockBeneficio);

    const result = await resultPromise;
    expect(result).toBe(true);
    expect(service.items().length).toBe(1);
  });

  it('deve atualizar um beneficio existente (changeOne)', async () => {
    (service as any).beneficiosList.set([mockBeneficio]);
    const updated = { ...mockBeneficio, nome: 'VR Atualizado' };

    const resultPromise = firstValueFrom(service.changeOne(updated));

    const req = httpMock.expectOne(
      `${environment.beneficiosApi}/${mockBeneficio.id}`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(updated);

    const result = await resultPromise;
    expect(result).toBe(true);
    expect(service.items()[0].nome).toBe('VR Atualizado');
  });

  it('deve chamar endpoint ativar quando ativo for true', () => {
    service.changeStatus(mockBeneficio);

    const req = httpMock.expectOne(
      `${environment.beneficiosApi}/${mockBeneficio.id}/ativar`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(mockBeneficio);
  });

  it('deve chamar endpoint cancelar quando ativo for false', () => {
    const inativo = { ...mockBeneficio, ativo: false };

    service.changeStatus(inativo);

    const req = httpMock.expectOne(
      `${environment.beneficiosApi}/${inativo.id}/cancelar`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(inativo);
  });

  it('deve propagar erro em getOne', async () => {
    const errorPromise = firstValueFrom(service.getOne(99)).catch((err) => err);

    const req = httpMock.expectOne(`${environment.beneficiosApi}/associado/99`);
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

import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CustomerService } from "./customer.service";
import { CustomerType } from "./customer-type";
import { NotificationService } from "../services/notification.service";
import { environment } from "../../environments/environment";
import { firstValueFrom } from "rxjs";

describe("CustomerService", () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  let notificationSpy: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockCustomer: CustomerType = {
    id: 1,
    name: "Jorge",
    email: "jorge@example.com",
    phone: "123456789",
    ativo: true,
  };

  beforeEach(() => {
    notificationSpy = { showSuccess: vi.fn(), showError: vi.fn() };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerService,
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  it("deve buscar todos os customers (getAll) e atualizar a signal", () => {
    const mockList = [mockCustomer];

    service.getAll();

    const req = httpMock.expectOne(environment.customersApi);
    expect(req.request.method).toBe("GET");
    req.flush(mockList);

    expect(service.items()).toEqual(mockList);
    expect(notificationSpy.showSuccess).toHaveBeenCalled();
  });

  it("deve buscar todos os customers com retorno booleano (getAllAndReturn)", async () => {
    const resultPromise = firstValueFrom(service.getAllAndReturn());

    const req = httpMock.expectOne(environment.customersApi);
    expect(req.request.method).toBe("GET");
    req.flush([mockCustomer]);

    const result = await resultPromise;
    expect(result).toBe(true);
    expect(service.items().length).toBe(1);
  });

  it("deve criar um novo customer (createOne)", async () => {
    const resultPromise = firstValueFrom(service.createOne(mockCustomer));

    const req = httpMock.expectOne(environment.customersApi);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(mockCustomer);
    req.flush(mockCustomer);

    const result = await resultPromise;
    expect(result).toBe(true);
    expect(service.items().length).toBe(1);
  });

  it("deve atualizar um customer existente (changeOne)", async () => {
    (service as any).customersList.set([mockCustomer]);
    const updated = { ...mockCustomer, name: "Jorge Atualizado" };

    const resultPromise = firstValueFrom(service.changeOne(updated));

    const req = httpMock.expectOne(
      `${environment.customersApi}/${mockCustomer.id}`,
    );
    expect(req.request.method).toBe("PUT");
    req.flush(updated);

    const result = await resultPromise;
    expect(result).toBe(true);
    expect(service.items()[0].name).toBe("Jorge Atualizado");
  });

  it("deve chamar endpoint delete quando ativo for false", () => {
    const inativo = { ...mockCustomer };

    service.removerCustomer(1);

    const req = httpMock.expectOne(`${environment.customersApi}/${inativo.id}`);
    expect(req.request.method).toBe("DELETE");
    req.flush(inativo);
  });

  it("deve propagar erro em getOne", async () => {
    const errorPromise = firstValueFrom(service.getOne(99)).catch((err) => err);

    const req = httpMock.expectOne(`${environment.customersApi}/99`);
    expect(req.request.method).toBe("GET");
    req.flush(
      { message: "Erro interno" },
      { status: 500, statusText: "Server Error" },
    );

    const err = (await errorPromise) as Error;
    expect(err.message).toContain("Erro interno");
    expect(notificationSpy.showError).toHaveBeenCalled();
  });
});

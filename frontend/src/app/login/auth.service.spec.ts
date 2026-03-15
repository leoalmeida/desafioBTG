import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { TokenStorageService } from "../services/token-storage.service";
import { firstValueFrom } from "rxjs";
import { createSpyObj, SpyObj } from "../../test-helpers/spy-utils";

describe("AuthService", () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenStorageSpy: SpyObj<TokenStorageService>;

  beforeEach(() => {
    const spy = createSpyObj<TokenStorageService>([
      "saveJsonWebToken",
      "signOut",
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: TokenStorageService, useValue: spy }],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenStorageSpy = TestBed.inject(
      TokenStorageService,
    ) as unknown as typeof tokenStorageSpy;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  it("deve realizar login e salvar o token", async () => {
    const user = await firstValueFrom(service.login("jrrtolk", "123"));
    expect(user).toBeDefined();
    expect(tokenStorageSpy.saveJsonWebToken).toHaveBeenCalled();
  });

  it("deve realizar logout e limpar o armazenamento", () => {
    service.logout();
    expect(tokenStorageSpy.signOut).toHaveBeenCalled();
  });

  it("deve registrar um novo usuário", async () => {
    const newUser = {
      username: "Maria",
      nome: "Maria",
      email: "maria@teste.com",
      telefone: "1188888888",
      password: "100",
    };

    const user = await firstValueFrom(
      service.register(
        newUser.username,
        newUser.nome,
        newUser.email,
        newUser.telefone,
        newUser.password,
      ),
    );
    expect(user.nome).toBe(newUser.nome);
    expect(user.email).toBe(newUser.email);
  });

  it("deve emitir o usuário logado através do observable loggedUser$", async () => {
    service.login("jrrtolk", "123");
    const user = await firstValueFrom(service.loggedUser$);
    expect(user).toBeDefined();
  });
});

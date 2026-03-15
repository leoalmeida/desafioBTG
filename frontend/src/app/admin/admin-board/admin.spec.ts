import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { AdminBoard } from "./admin-board";
import { NotificationService } from "src/app/services/notification.service";
import { TitleService } from "src/app/services/title.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { AuthService } from "src/app/login/auth.service";

describe("AdminBoard", () => {
  let component: AdminBoard;
  let fixture: ComponentFixture<AdminBoard>;
  let titleServiceSpy: { setTitle: ReturnType<typeof vi.fn> };
  let authServiceSpy: { items: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    titleServiceSpy = { setTitle: vi.fn() };
    authServiceSpy = { items: vi.fn().mockReturnValue([]) };

    await TestBed.configureTestingModule({
      imports: [AdminBoard],
      providers: [
        {
          provide: TokenStorageService,
          useValue: { loggedUser$: of({ id: 1, nome: "Admin" }) },
        },
        { provide: TitleService, useValue: titleServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: NotificationService,
          useValue: { showSuccess: vi.fn(), showError: vi.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve chamar setTitle no ngOnInit", () => {
    expect(titleServiceSpy.setTitle).toHaveBeenCalled();
    expect(authServiceSpy.items).toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toolbar } from './toolbar';
import { TokenStorageService } from '../../services/token-storage.service';
import { BehaviorSubject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TitleService } from '../../services/title.service';
import { UserType } from 'src/app/users/user-type';
import { CustomerService } from 'src/app/customers/customer.service';
import { OrderService } from 'src/app/orders/order.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LoadingService } from '../loading-indicator/loading.service';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';
import { signal } from '@angular/core';
import { makeUser } from '../../../test-helpers/domain-fixtures';

describe('Toolbar', () => {
  let component: Toolbar;
  let fixture: ComponentFixture<Toolbar>;
  let tokenStorageSpy: SpyObj<TokenStorageService>;
  let titleServiceSpy: SpyObj<TitleService>;
  let customerServiceSpy: SpyObj<CustomerService>;
  let orderServiceSpy: SpyObj<OrderService>;
  let notificationServiceSpy: SpyObj<NotificationService>;
  let loadingServiceSpy: SpyObj<LoadingService>;
  let loggedUserSubject: BehaviorSubject<UserType>;
  let autenticadoSubject: BehaviorSubject<boolean>;
  let titleSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    loggedUserSubject = new BehaviorSubject<UserType>(makeUser());
    autenticadoSubject = new BehaviorSubject<boolean>(false);
    titleSubject = new BehaviorSubject<string>('Frontend App');

    tokenStorageSpy = createSpyObj<TokenStorageService>([], {
      loggedUser$: loggedUserSubject.asObservable(),
      autenticado$: autenticadoSubject.asObservable(),
    } as Partial<TokenStorageService>);
    titleServiceSpy = createSpyObj<TitleService>([], {
      title$: titleSubject.asObservable(),
    } as Partial<TitleService>);
    customerServiceSpy = createSpyObj<CustomerService>(['getAll'], {
      items: signal([]),
    } as Partial<CustomerService>);
    orderServiceSpy = createSpyObj<OrderService>(['getAll', 'filterByCustomer']);
    notificationServiceSpy = createSpyObj<NotificationService>([
      'showError',
      'showSuccess',
    ]);
    loadingServiceSpy = createSpyObj<LoadingService>([
      'loadingOn',
      'loadingOff',
    ]);

    await TestBed.configureTestingModule({
      imports: [Toolbar],
      providers: [
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        { provide: TitleService, useValue: titleServiceSpy },
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Toolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o título recebido do TitleService', () => {
    titleSubject.next('BIP App');
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.head-title'))
      .nativeElement as HTMLElement;
    expect(titleElement.textContent).toContain('BIP App');
  });

  it('deve atualizar loggedUser quando o serviço emitir um novo usuário', () => {
    const novoUsuario: UserType = {
      id: 2,
      nome: 'Admin',
      email: 'admin@test.com',
      telefone: '11888887777',
      username: 'admin',
      stats: [],
      logs: [],
    };
    loggedUserSubject.next(novoUsuario);

    expect((component as any).loggedUser().nome).toBe('Admin');
  });

  it('deve alternar o estado de "opened" ao interagir com o menu (simulação lógica)', () => {
    expect(component.opened).toBe(false);
    component.opened = !component.opened;
    expect(component.opened).toBe(true);
  });

  it('deve renderizar os links de navegação baseados nas rotas', () => {
    autenticadoSubject.next(true);
    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBeGreaterThan(0);
  });

  it('deve exibir o nome do usuário logado no template', () => {
    autenticadoSubject.next(true);
    loggedUserSubject.next({
      id: 3,
      nome: 'Carlos Silva',
      email: 'carlos@test.com',
      telefone: '11777776666',
      username: 'carlos',
      stats: [],
      logs: [],
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Carlos Silva');
  });
});

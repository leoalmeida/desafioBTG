import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerList } from './customer-list';
import { CustomerService } from '../customer.service';
import { LoadingService } from '../../core/loading-indicator/loading.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { CustomerType } from '../customer-type';
import { UserType } from '../../users/user-type';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';

describe('CustomerList', () => {
  let component: CustomerList;
  let fixture: ComponentFixture<CustomerList>;
  let customerServiceSpy: SpyObj<CustomerService>;
  let loadingServiceSpy: SpyObj<LoadingService>;
  let tokenStorageServiceSpy: SpyObj<TokenStorageService>;
  let dialogSpy: SpyObj<MatDialog>;

  const mockCustomers: CustomerType[] = [
    { id: 1, nome: 'Vale Refeição', descricao: 'VR', valor: 100, ativo: true },
    { id: 2, nome: 'Plano de Saúde', descricao: 'PS', valor: 200, ativo: true },
  ];

  const mockUser: UserType = {
    id: 1,
    email: 'user@test.com',
    nome: 'Usuario Teste',
    telefone: '11999990000',
    username: 'user',
    stats: [],
    logs: [],
  };

  beforeEach(async () => {
    customerServiceSpy = createSpyObj<CustomerService>(['getAll'], {
      items: signal(mockCustomers),
    } as Partial<CustomerService>);
    loadingServiceSpy = createSpyObj<LoadingService>([
      'loadingOn',
      'loadingOff',
    ]);
    tokenStorageServiceSpy = createSpyObj<TokenStorageService>([], {
      loggedUser$: of(mockUser),
    } as Partial<TokenStorageService>);
    dialogSpy = createSpyObj<MatDialog>(['open']);

    await TestBed.configureTestingModule({
      imports: [CustomerList, NoopAnimationsModule],
      providers: [
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: TokenStorageService, useValue: tokenStorageServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente e carregar dados iniciais', () => {
    expect(component).toBeTruthy();
    expect(customerServiceSpy.getAll).toHaveBeenCalled();
    expect(loadingServiceSpy.loadingOn).toHaveBeenCalled();
    expect(loadingServiceSpy.loadingOff).toHaveBeenCalled();
  });

  it('deve filtrar a lista de clientes com base na searchQuery', () => {
    component.searchQuery.set('vale');
    fixture.detectChanges();

    const filtered = component.filteredCustomerList();
    expect(filtered?.length).toBe(1);
    expect(filtered![0].nome).toBe('Vale Refeição');
  });

  it('deve filtrar sem diferenciar maiúsculas e minúsculas', () => {
    component.searchQuery.set('PLANO');
    fixture.detectChanges();

    const filtered = component.filteredCustomerList();
    expect(filtered?.length).toBe(1);
    expect(filtered![0].nome).toBe('Plano de Saúde');
  });

  it('deve atualizar searchQuery ao chamar handleMessage', () => {
    const query = 'nova busca';
    component.handleMessage(query);
    expect(component.searchQuery()).toBe(query);
  });
});

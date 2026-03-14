import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderList } from './order-list';
import { OrderService } from '../order.service';
import { LoadingService } from '../../core/loading-indicator/loading.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { OrderType } from '../order-type';
import { UserType } from '../../users/user-type';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';

describe('OrderList', () => {
  let component: OrderList;
  let fixture: ComponentFixture<OrderList>;
  let orderServiceSpy: SpyObj<OrderService>;
  let loadingServiceSpy: SpyObj<LoadingService>;
  let tokenStorageServiceSpy: SpyObj<TokenStorageService>;
  let dialogSpy: SpyObj<MatDialog>;

  const mockOrders: OrderType[] = [
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
    orderServiceSpy = createSpyObj<OrderService>(['getAll'], {
      items: signal(mockOrders),
    } as Partial<OrderService>);
    loadingServiceSpy = createSpyObj<LoadingService>([
      'loadingOn',
      'loadingOff',
    ]);
    tokenStorageServiceSpy = createSpyObj<TokenStorageService>([], {
      loggedUser$: of(mockUser),
    } as Partial<TokenStorageService>);
    dialogSpy = createSpyObj<MatDialog>(['open']);

    await TestBed.configureTestingModule({
      imports: [OrderList, NoopAnimationsModule],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: TokenStorageService, useValue: tokenStorageServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente e carregar dados iniciais', () => {
    expect(component).toBeTruthy();
    expect(orderServiceSpy.getAll).toHaveBeenCalled();
    expect(loadingServiceSpy.loadingOn).toHaveBeenCalled();
    expect(loadingServiceSpy.loadingOff).toHaveBeenCalled();
  });

  it('deve filtrar a lista de pedidos com base na searchQuery', () => {
    component.searchQuery.set('vale');
    fixture.detectChanges();

    const filtered = component.filteredOrderList();
    expect(filtered?.length).toBe(1);
    expect(filtered![0].nome).toBe('Vale Refeição');
  });

  it('deve filtrar sem diferenciar maiúsculas e minúsculas', () => {
    component.searchQuery.set('PLANO');
    fixture.detectChanges();

    const filtered = component.filteredOrderList();
    expect(filtered?.length).toBe(1);
    expect(filtered![0].nome).toBe('Plano de Saúde');
  });

  it('deve atualizar searchQuery ao chamar handleMessage', () => {
    const query = 'nova busca';
    component.handleMessage(query);
    expect(component.searchQuery()).toBe(query);
  });
});

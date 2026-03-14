import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderCard } from './order-card';
import { OrderService } from '../order.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TemplateRef } from '@angular/core';
import { OrderType } from '../order-type';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';

describe('OrderCard', () => {
  let component: OrderCard;
  let fixture: ComponentFixture<OrderCard>;
  let orderServiceSpy: SpyObj<OrderService>;
  let notificationServiceSpy: SpyObj<NotificationService>;
  let dialogSpy: SpyObj<MatDialog>;

  const mockOrder: OrderType = {
    id: 1,
    nome: 'Vale Alimentação',
    descricao: 'Benefício para alimentação',
    valor: 500,
    ativo: true,
  };

  beforeEach(async () => {
    orderServiceSpy = createSpyObj<OrderService>(['changeStatus']);
    notificationServiceSpy = createSpyObj<NotificationService>([
      'showSuccess',
      'showError',
    ]);
    dialogSpy = createSpyObj<MatDialog>(['open']);

    await TestBed.configureTestingModule({
      imports: [OrderCard, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCard);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('order', mockOrder);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve mostrar erro quando não houver id do benefício para alterar status', () => {
    const orderSemId = { ...mockOrder, id: undefined };
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as MouseEvent;

    fixture.componentRef.setInput('order', orderSemId);
    fixture.detectChanges();

    component.onAlterarStatus(mockEvent, {} as TemplateRef<any>);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
      'Nenhum benefício selecionado.',
    );
    expect(dialogSpy.open).not.toHaveBeenCalled();
  });
});

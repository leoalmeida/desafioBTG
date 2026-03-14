import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerCard } from './customer-card';
import { CustomerService } from '../customer.service';
import { OrderService } from 'src/app/orders/order.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TemplateRef } from '@angular/core';
import { CustomerType } from '../customer-type';
import { of } from 'rxjs';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';
import { makeCustomer } from '../../../test-helpers/domain-fixtures';

describe('CustomerCard', () => {
  let component: CustomerCard;
  let fixture: ComponentFixture<CustomerCard>;
  let customerServiceSpy: SpyObj<CustomerService>;
  let orderServiceSpy: SpyObj<OrderService>;
  let notificationServiceSpy: SpyObj<NotificationService>;
  let dialogSpy: SpyObj<MatDialog>;

  const mockCustomer: CustomerType = {
    ...makeCustomer({ id: 1, name: 'Cliente 1' }),
  };

  beforeEach(async () => {
    customerServiceSpy = createSpyObj<CustomerService>(['removerCustomer']);
    orderServiceSpy = createSpyObj<OrderService>(['addOne']);
    notificationServiceSpy = createSpyObj<NotificationService>([
      'showSuccess',
      'showError',
    ]);
    dialogSpy = createSpyObj<MatDialog>(['open']);
    (dialogSpy.open as any).mockReturnValue({
      afterClosed: () => of(false),
    } as any);

    await TestBed.configureTestingModule({
      imports: [CustomerCard, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerCard);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('customer', mockCustomer);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve mostrar erro quando nao houver id do cliente para remover', () => {
    const customerSemId = { ...mockCustomer, id: undefined };
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as MouseEvent;

    fixture.componentRef.setInput('customer', customerSemId);
    fixture.detectChanges();

    component.onRemoveCustomer(mockEvent, {} as TemplateRef<any>);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
      'Nenhum cliente selecionado.',
    );
    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  it('deve chamar addOne ao adicionar pedido para cliente', () => {
    component.onAddCustomerOrder();

    expect(orderServiceSpy.addOne).toHaveBeenCalledWith(1);
  });
});

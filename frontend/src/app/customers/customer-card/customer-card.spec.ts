import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerCard } from './customer-card';
import { CustomerService } from '../customer.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TemplateRef } from '@angular/core';
import { CustomerType } from '../customer-type';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';

describe('CustomerCard', () => {
  let component: CustomerCard;
  let fixture: ComponentFixture<CustomerCard>;
  let customerServiceSpy: SpyObj<CustomerService>;
  let notificationServiceSpy: SpyObj<NotificationService>;
  let dialogSpy: SpyObj<MatDialog>;

  const mockCustomer: CustomerType = {
    id: 1,
    nome: 'Vale Alimentação',
    descricao: 'Benefício para alimentação',
    valor: 500,
    ativo: true,
  };

  beforeEach(async () => {
    customerServiceSpy = createSpyObj<CustomerService>(['changeStatus']);
    notificationServiceSpy = createSpyObj<NotificationService>([
      'showSuccess',
      'showError',
    ]);
    dialogSpy = createSpyObj<MatDialog>(['open']);

    await TestBed.configureTestingModule({
      imports: [CustomerCard, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: CustomerService, useValue: customerServiceSpy },
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

  it('deve mostrar erro quando não houver id do benefício para alterar status', () => {
    const customerSemId = { ...mockCustomer, id: undefined };
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as MouseEvent;

    fixture.componentRef.setInput('customer', customerSemId);
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

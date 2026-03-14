import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderItemDetails } from './order-item-details';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OrderService } from '../order.service';
import { OrderItemType } from '../order-type';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';
import { makeOrderItem } from '../../../test-helpers/domain-fixtures';

describe('OrderItemDetails', () => {
  let component: OrderItemDetails;
  let fixture: ComponentFixture<OrderItemDetails>;
  let dialogRefSpy: SpyObj<MatDialogRef<OrderItemDetails>, 'close'>;
  let orderServiceSpy: SpyObj<OrderService>;

  const mockOrderItem: OrderItemType = makeOrderItem({
    id: 1,
    productName: 'Produto Inicial',
    quantity: 2,
    price: 15,
  });

  beforeEach(async () => {
    dialogRefSpy = createSpyObj<MatDialogRef<OrderItemDetails>>(['close']);
    orderServiceSpy = createSpyObj<OrderService>([]);

    await TestBed.configureTestingModule({
      imports: [OrderItemDetails, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockOrderItem },
        { provide: OrderService, useValue: orderServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulario com os dados recebidos via MAT_DIALOG_DATA', () => {
    expect(component.formOrderItem.value).toEqual({
      id: mockOrderItem.id,
      productName: mockOrderItem.productName,
      quantity: mockOrderItem.quantity,
      price: mockOrderItem.price,
      ativo: true,
    });
  });

  it('deve invalidar o formulario se campos obrigatorios estiverem vazios', () => {
    component.formOrderItem.controls['productName'].setValue('');
    component.formOrderItem.controls['quantity'].setValue(0);
    component.formOrderItem.controls['price'].setValue(0);

    expect(component.formOrderItem.valid).toBe(false);
  });

  it('deve fechar o dialogo com orderItem ao chamar onSubmit se valido', () => {
    const updatedValue = {
      id: 1,
      productName: 'Produto Atualizado',
      quantity: 3,
      price: 20,
      ativo: true,
    };
    component.formOrderItem.patchValue(updatedValue);

    component.onSubmit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(updatedValue);
  });

  it('nao deve fechar o dialogo ao chamar onSubmit se o formulario for invalido', () => {
    component.formOrderItem.controls['productName'].setValue('');
    component.onSubmit();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('deve fechar o diálogo sem dados ao chamar onCancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});

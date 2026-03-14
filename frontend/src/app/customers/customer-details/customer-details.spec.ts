import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerDetails } from './customer-details';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerType } from '../customer-type';
import { CustomerService } from '../customer.service';
import { of } from 'rxjs';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';

describe('CustomerDetails', () => {
  let component: CustomerDetails;
  let fixture: ComponentFixture<CustomerDetails>;
  let dialogRefSpy: SpyObj<MatDialogRef<CustomerDetails>, 'close'>;
  let customerServiceSpy: SpyObj<CustomerService, 'createOne' | 'changeOne'>;

  const mockCustomer: CustomerType = {
    id: 1,
    nome: 'Vale Refeição',
    descricao: 'Benefício de refeição diária',
    valor: 450.5,
    ativo: true,
  };

  beforeEach(async () => {
    dialogRefSpy = createSpyObj<MatDialogRef<CustomerDetails>>(['close']);
    customerServiceSpy = createSpyObj<CustomerService>([
      'createOne',
      'changeOne',
    ]);
    customerServiceSpy.changeOne.mockReturnValue(of(true));
    customerServiceSpy.createOne.mockReturnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [CustomerDetails, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockCustomer },
        { provide: CustomerService, useValue: customerServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com os dados recebidos via MAT_DIALOG_DATA', () => {
    expect(component.formCustomer.value).toEqual({
      nome: mockCustomer.nome,
      descricao: mockCustomer.descricao,
      valor: mockCustomer.valor,
      ativo: mockCustomer.ativo,
    });
  });

  it('deve invalidar o formulário se campos obrigatórios estiverem vazios', () => {
    component.formCustomer.controls['nome'].setValue('');
    component.formCustomer.controls['valor'].setValue(null);

    expect(component.formCustomer.valid).toBe(false);
  });

  it('deve fechar o diálogo com true ao chamar onSubmit se válido', () => {
    const updatedValue = {
      nome: 'Novo Nome',
      descricao: 'Nova Descrição',
      valor: 600,
      ativo: false,
    };
    component.formCustomer.patchValue(updatedValue);

    component.onSubmit();

    expect(customerServiceSpy.changeOne).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('não deve fechar o diálogo ao chamar onSubmit se o formulário for inválido', () => {
    component.formCustomer.controls['nome'].setValue('');
    component.onSubmit();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('deve fechar o diálogo sem dados ao chamar onCancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});

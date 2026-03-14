import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferDetails } from './transfer-details';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BeneficioType } from 'src/app/models/beneficio-type';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { BeneficioService } from 'src/app/services/beneficio.service';
import { NotificationService } from 'src/app/services/notification.service';
import { of } from 'rxjs';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';

describe('TransferDetails', () => {
  let component: TransferDetails;
  let fixture: ComponentFixture<TransferDetails>;
  let dialogRefSpy: SpyObj<MatDialogRef<TransferDetails>, 'close'>;
  let transferenciaServiceSpy: SpyObj<TransferenciaService, 'transferValue'>;
  let beneficioServiceSpy: SpyObj<BeneficioService, 'getAll'>;
  let notificationServiceSpy: SpyObj<
    NotificationService,
    'showSuccess' | 'showError'
  >;

  const mockBeneficio: BeneficioType = {
    id: 1,
    nome: 'Vale Alimentação',
    descricao: 'VR',
    valor: 500,
    ativo: true,
  };

  beforeEach(async () => {
    dialogRefSpy = createSpyObj<MatDialogRef<TransferDetails>>(['close']);
    transferenciaServiceSpy = createSpyObj<TransferenciaService>([
      'transferValue',
    ]);
    transferenciaServiceSpy.transferValue.mockReturnValue(of(true));
    beneficioServiceSpy = createSpyObj<BeneficioService>(['getAll']);
    notificationServiceSpy = createSpyObj<NotificationService>([
      'showSuccess',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [TransferDetails, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockBeneficio },
        { provide: TransferenciaService, useValue: transferenciaServiceSpy },
        { provide: BeneficioService, useValue: beneficioServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferDetails);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com o ID do benefício de origem', () => {
    fixture.detectChanges();
    expect(component.formTransferencia.value.fromId).toBe(mockBeneficio.id);
    expect(component.formTransferencia.value.valor).toBe(0);
  });

  it('deve invalidar o formulário se o ID de destino (toId) não for preenchido', () => {
    fixture.detectChanges();
    component.formTransferencia.controls['toId'].setValue('');
    expect(component.formTransferencia.valid).toBe(false);
  });

  it('deve fechar o diálogo ao chamar onSubmit se válido', () => {
    fixture.detectChanges();
    const transferData = {
      fromId: 1,
      toId: 2,
      valor: 150.5,
    };
    component.formTransferencia.patchValue(transferData);

    component.onSubmit();

    expect(transferenciaServiceSpy.transferValue).toHaveBeenCalledWith(
      expect.objectContaining(transferData),
    );
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('não deve fechar o diálogo ao chamar onSubmit se o formulário for inválido', () => {
    fixture.detectChanges();
    component.formTransferencia.controls['toId'].setValue('');

    component.onSubmit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('deve fechar o diálogo sem dados ao chamar onCancel', () => {
    fixture.detectChanges();
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});

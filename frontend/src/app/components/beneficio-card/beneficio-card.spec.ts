import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficioCard } from './beneficio-card';
import { BeneficioService } from '../../services/beneficio.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TemplateRef } from '@angular/core';
import { BeneficioType } from '../../models/beneficio-type';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';

describe('BeneficioCard', () => {
  let component: BeneficioCard;
  let fixture: ComponentFixture<BeneficioCard>;
  let beneficioServiceSpy: SpyObj<BeneficioService>;
  let notificationServiceSpy: SpyObj<NotificationService>;
  let dialogSpy: SpyObj<MatDialog>;

  const mockBeneficio: BeneficioType = {
    id: 1,
    nome: 'Vale Alimentação',
    descricao: 'Benefício para alimentação',
    valor: 500,
    ativo: true,
  };

  beforeEach(async () => {
    beneficioServiceSpy = createSpyObj<BeneficioService>(['changeStatus']);
    notificationServiceSpy = createSpyObj<NotificationService>([
      'showSuccess',
      'showError',
    ]);
    dialogSpy = createSpyObj<MatDialog>(['open']);

    await TestBed.configureTestingModule({
      imports: [BeneficioCard, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: BeneficioService, useValue: beneficioServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioCard);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('beneficio', mockBeneficio);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve mostrar erro quando não houver id do benefício para alterar status', () => {
    const beneficioSemId = { ...mockBeneficio, id: undefined };
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as MouseEvent;

    fixture.componentRef.setInput('beneficio', beneficioSemId);
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

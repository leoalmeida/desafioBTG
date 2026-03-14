import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficioList } from './beneficio-list';
import { BeneficioService } from '../../services/beneficio.service';
import { LoadingService } from '../loading-indicator/loading.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { BeneficioType } from '../../models/beneficio-type';
import { AssociadoType } from '../../models/associado-type';
import { createSpyObj, SpyObj } from '../../../test-helpers/spy-utils';

describe('BeneficioList', () => {
  let component: BeneficioList;
  let fixture: ComponentFixture<BeneficioList>;
  let beneficioServiceSpy: SpyObj<BeneficioService>;
  let loadingServiceSpy: SpyObj<LoadingService>;
  let tokenStorageServiceSpy: SpyObj<TokenStorageService>;
  let dialogSpy: SpyObj<MatDialog>;

  const mockBeneficios: BeneficioType[] = [
    { id: 1, nome: 'Vale Refeição', descricao: 'VR', valor: 100, ativo: true },
    { id: 2, nome: 'Plano de Saúde', descricao: 'PS', valor: 200, ativo: true },
  ];

  const mockUser: AssociadoType = {
    id: 1,
    email: 'user@test.com',
    nome: 'Usuario Teste',
    telefone: '11999990000',
    username: 'user',
    stats: [],
    logs: [],
  };

  beforeEach(async () => {
    beneficioServiceSpy = createSpyObj<BeneficioService>(['getAll'], {
      items: signal(mockBeneficios),
    } as Partial<BeneficioService>);
    loadingServiceSpy = createSpyObj<LoadingService>([
      'loadingOn',
      'loadingOff',
    ]);
    tokenStorageServiceSpy = createSpyObj<TokenStorageService>([], {
      loggedUser$: of(mockUser),
    } as Partial<TokenStorageService>);
    dialogSpy = createSpyObj<MatDialog>(['open']);

    await TestBed.configureTestingModule({
      imports: [BeneficioList, NoopAnimationsModule],
      providers: [
        { provide: BeneficioService, useValue: beneficioServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: TokenStorageService, useValue: tokenStorageServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente e carregar dados iniciais', () => {
    expect(component).toBeTruthy();
    expect(beneficioServiceSpy.getAll).toHaveBeenCalled();
    expect(loadingServiceSpy.loadingOn).toHaveBeenCalled();
    expect(loadingServiceSpy.loadingOff).toHaveBeenCalled();
  });

  it('deve filtrar a lista de benefícios com base na searchQuery', () => {
    component.searchQuery.set('vale');
    fixture.detectChanges();

    const filtered = component.filteredBeneficioList();
    expect(filtered?.length).toBe(1);
    expect(filtered![0].nome).toBe('Vale Refeição');
  });

  it('deve filtrar sem diferenciar maiúsculas e minúsculas', () => {
    component.searchQuery.set('PLANO');
    fixture.detectChanges();

    const filtered = component.filteredBeneficioList();
    expect(filtered?.length).toBe(1);
    expect(filtered![0].nome).toBe('Plano de Saúde');
  });

  it('deve atualizar searchQuery ao chamar handleMessage', () => {
    const query = 'nova busca';
    component.handleMessage(query);
    expect(component.searchQuery()).toBe(query);
  });
});

import { MatButtonModule } from '@angular/material/button';
import { Component, computed, inject, signal } from '@angular/core';
import { BeneficioService } from '../../services/beneficio.service';
import { LoadingService } from '../loading-indicator/loading.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { BeneficioCard } from '../beneficio-card/beneficio-card';
import { Searchbar } from '../searchbar/searchbar';
import { BeneficioDetails } from '../beneficio-details/beneficio-details';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AssociadoType } from 'src/app/models/associado-type';
import { NotificationService } from 'src/app/services/notification.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-beneficio-list',
  standalone: true,
  imports: [
    BeneficioCard,
    Searchbar,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './beneficio-list.html',
  styleUrls: ['./beneficio-list.css'],
})
export class BeneficioList {
  protected loggedUser = signal({} as AssociadoType);
  searchQuery = signal<string>('');

  private beneficioService: BeneficioService = inject(BeneficioService);
  private loadingService: LoadingService = inject(LoadingService);
  private tokenStorageService: TokenStorageService =
    inject(TokenStorageService);
  private dialogAcao: MatDialog = inject(MatDialog);
  private notify: NotificationService = inject(NotificationService);

  constructor() {
    try {
      this.loadingService.loadingOn();
      this.tokenStorageService.loggedUser$.subscribe((user) => {
        this.loggedUser.set(user);
      });
      this.beneficioService.getAll();
    } catch (error: any) {
      this.notify.showError(error.message || 'Erro ao identificar usuário.');
    } finally {
      this.loadingService.loadingOff();
    }
  }

  filteredBeneficioList = computed(() => {
    try {
      this.loadingService.loadingOn();
      const normalizedQuery = this.searchQuery()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      return this.beneficioService
        .items()
        .filter((x) => x?.nome.toLowerCase().includes(normalizedQuery));
    } catch (error: any) {
      this.notify.showError(error.message || 'Erro ao filtrar benefícios.');
      return [];
    } finally {
      this.loadingService.loadingOff();
    }
  });

  handleMessage(message: string): void {
    this.searchQuery.set(message);
  }

  onCreateBeneficio(): void {
    const dialogRef = this.dialogAcao.open(BeneficioDetails, {
      width: '500px',
      data: {},
    });
    // Mantem o fluxo de fechamento sem side effects de log.
    dialogRef.afterClosed().subscribe();
  }
}

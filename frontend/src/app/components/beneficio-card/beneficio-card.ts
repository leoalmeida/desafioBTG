import { MatButtonModule } from '@angular/material/button';
import { Component, inject, input, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BeneficioType } from '../../models/beneficio-type';
import { BeneficioService } from '../../services/beneficio.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { BeneficioDetails } from '../beneficio-details/beneficio-details';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from 'src/app/services/notification.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-beneficio-card',
  imports: [
    CurrencyPipe,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatBadgeModule,
    FormsModule,
  ],
  templateUrl: './beneficio-card.html',
  styleUrl: './beneficio-card.css',
})
export class BeneficioCard {
  beneficio = input.required<BeneficioType>();
  private beneficioService: BeneficioService = inject(BeneficioService);
  message = '';

  private dialogAcao: MatDialog = inject(MatDialog);
  private notify: NotificationService = inject(NotificationService);

  constructor() {}

  onUpdateBeneficio(beneficio: BeneficioType): void {
    const dialogRef = this.dialogAcao.open(BeneficioDetails, {
      width: '500px',
      data: { ...beneficio },
    });

    // Chama serviço para atualizar beneficio após fechamento do diálogo
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notify.showSuccess('Atualização realizada com sucesso!');
      }
    });
  }

  onAlterarStatus(event: MouseEvent, dialogRef: TemplateRef<any>): void {
    // Previne a ação padrão do botão do Card de edição do benefício (form submit)
    event.preventDefault();
    event.stopPropagation();
    if (!this.beneficio().id) {
      this.notify.showError('Nenhum benefício selecionado.');
      return;
    }
    const refOpen = this.dialogAcao.open(dialogRef, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        message: `Tem certeza que deseja ${!this.beneficio().ativo ? 'cancelar' : 'ativar'} o benefício ${this.beneficio().nome}?`,
      },
    });
    refOpen.afterClosed().subscribe((result) => {
      if (result == true) {
        this.beneficioService.changeStatus(this.beneficio());
      } else {
        this.beneficio().ativo = !this.beneficio().ativo;
      }
    });
  }
}

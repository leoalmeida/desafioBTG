import { CommonModule, CurrencyPipe } from '@angular/common';
import { TransferenciaType } from './../../models/transferencia-type';
import { Component, computed, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BeneficioType } from 'src/app/models/beneficio-type';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { BeneficioService } from 'src/app/services/beneficio.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LoadingService } from '../loading-indicator/loading.service';

@Component({
  selector: 'app-transfer-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
  ],
  providers: [CurrencyPipe],
  templateUrl: './transfer-details.html',
})
export class TransferDetails {
  private transferenciaService = inject(TransferenciaService);
  private beneficioService = inject(BeneficioService);
  private notify = inject(NotificationService);
  private loadingService: LoadingService = inject(LoadingService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private dialogRef: MatDialogRef<TransferDetails> = inject(MatDialogRef);
  public data: BeneficioType = inject(MAT_DIALOG_DATA) as BeneficioType;
  formTransferencia: FormGroup = this.formBuilder.group({
    fromId: [0, Validators.required],
    toId: [0, Validators.required],
    valor: [0.0, [Validators.required, Validators.min(0.01)]],
  });

  listaBeneficiosAtivos: BeneficioType[] = [];

  constructor() {
    this.formTransferencia.patchValue({ fromId: this.data?.id ?? 0 });
  }

  filteredActiveList = computed(() => {
    try {
      this.loadingService.loadingOn();
      return this.beneficioService.items().filter((x) => x?.ativo === true);
    } catch (error: any) {
      this.notify.showError(error.message || 'Erro ao filtrar benefícios.');
      return [];
    } finally {
      this.loadingService.loadingOff();
    }
  });

  onSubmit(): void {
    if (this.formTransferencia.valid) {
      const transfer: TransferenciaType = {
        ...this.formTransferencia.value,
      };

      this.transferenciaService.transferValue(transfer).subscribe({
        next: () => {
          this.notify.showSuccess('Transferência realizada com sucesso!');
          this.beneficioService.getAll();
          this.dialogRef.close();
        },
      });
    } else {
      this.notify.showError('Dados da transferência inválidos ou incompletos!');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

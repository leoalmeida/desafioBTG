import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BeneficioType } from '../../models/beneficio-type';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { BeneficioService } from 'src/app/services/beneficio.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-beneficio-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
  ],
  templateUrl: './beneficio-details.html',
  styleUrls: ['./beneficio-details.css'],
})
export class BeneficioDetails {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private dialogRef: MatDialogRef<BeneficioDetails> = inject(MatDialogRef);
  public data: BeneficioType = inject(MAT_DIALOG_DATA) as BeneficioType;
  private beneficioService = inject(BeneficioService);
  openType: 'create' | 'edit' = this.data && this.data.id ? 'edit' : 'create';

  formBeneficio = this.formBuilder.group({
    nome: ['', Validators.required],
    descricao: [''],
    valor: [0.0, [Validators.required, Validators.min(0.01)]],
    ativo: [true, Validators.required],
  });

  constructor() {
    if (this.openType === 'edit') {
      this.formBeneficio.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.formBeneficio.valid) {
      const beneficio = {
        ...this.data,
        ...this.formBeneficio.value,
      } as BeneficioType;
      if (this.openType === 'create') {
        this.beneficioService.createOne(beneficio).subscribe({
          next: (created) => {
            this.dialogRef.close(created);
          },
        });
      } else if (this.openType === 'edit') {
        this.beneficioService.changeOne(beneficio).subscribe({
          next: (updated) => {
            this.dialogRef.close(updated);
          },
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

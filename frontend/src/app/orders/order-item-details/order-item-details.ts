import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OrderItemType, OrderType } from '../order-type';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-order-item-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './order-item-details.html',
  styleUrls: ['./order-item-details.css'],
})
export class OrderItemDetails {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private dialogRef: MatDialogRef<OrderItemDetails> = inject(MatDialogRef);
  public data: OrderItemType = inject(MAT_DIALOG_DATA) as OrderItemType;
  private orderService = inject(OrderService);
  openType: 'create' | 'edit' = this.data && this.data.id>=0 ? 'edit' : 'create';

  formOrderItem = this.formBuilder.group({
    id: [-1],
    productName: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(1)]],
    price: [0.0, [Validators.required, Validators.min(0.01)]]
  });

  constructor() {
    if (this.openType === 'edit') {
      this.formOrderItem.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.formOrderItem.valid) {
      const orderItem = {
        ...this.data,
        ...this.formOrderItem.value,
      } as OrderItemType;
      
      this.dialogRef.close(orderItem);
      
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

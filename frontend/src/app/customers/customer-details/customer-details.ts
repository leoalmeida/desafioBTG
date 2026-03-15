import { MatFormFieldModule } from "@angular/material/form-field";
import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CustomerType } from "../customer-type";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CommonModule } from "@angular/common";
import { CustomerService } from "../customer.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "app-customer-details",
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
  templateUrl: "./customer-details.html",
  styleUrls: ["./customer-details.css"],
})
export class CustomerDetails {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private dialogRef: MatDialogRef<CustomerDetails> = inject(MatDialogRef);
  public data: CustomerType = inject(MAT_DIALOG_DATA) as CustomerType;
  private customerService = inject(CustomerService);
  openType: "create" | "edit" = this.data && this.data.id ? "edit" : "create";

  formCustomer = this.formBuilder.group({
    nome: ["", Validators.required],
    descricao: [""],
    valor: [0.0, [Validators.required, Validators.min(0.01)]],
    ativo: [true, Validators.required],
  });

  constructor() {
    if (this.openType === "edit") {
      this.formCustomer.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.formCustomer.valid) {
      const customer = {
        ...this.data,
        ...this.formCustomer.value,
      } as CustomerType;
      if (this.openType === "create") {
        this.customerService.createOne(customer).subscribe({
          next: (created) => {
            this.dialogRef.close(created);
          },
        });
      } else if (this.openType === "edit") {
        this.customerService.changeOne(customer).subscribe({
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

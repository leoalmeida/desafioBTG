import { MatButtonModule } from '@angular/material/button';
import { Component, inject, input, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerType } from '../customer-type';
import { CustomerService } from '../customer.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { CustomerDetails } from '../customer-details/customer-details';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from 'src/app/services/notification.service';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from 'src/app/orders/order.service';

@Component({
  selector: 'app-customer-card',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatBadgeModule,
    FormsModule,
  ],
  templateUrl: './customer-card.html',
  styleUrl: './customer-card.css',
})
export class CustomerCard {
  customer = input.required<CustomerType>();
  private customerService: CustomerService = inject(CustomerService);
  message = '';

  private dialogAcao: MatDialog = inject(MatDialog);
  private notify: NotificationService = inject(NotificationService);
  private orderService: OrderService = inject(OrderService);

  constructor() {}

  onAddCustomerOrder(): void {
    this.orderService.addOne(this.customer().id);
  }

  onUpdateCustomer(): void {
    const dialogRef = this.dialogAcao.open(CustomerDetails, {
      width: '500px',
      data: { ...this.customer() },
    });

    // Chama serviço para atualizar customer após fechamento do diálogo
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notify.showSuccess('Atualização realizada com sucesso!');
      }
    });
  }

  onRemoveCustomer(event: MouseEvent, dialogRef: TemplateRef<any>): void {
    // Previne a ação padrão do botão do Card de edição do customer (form submit)
    event.preventDefault();
    event.stopPropagation();
    if (!this.customer().id) {
      this.notify.showError('Nenhum cliente selecionado.');
      return;
    }
    const refOpen = this.dialogAcao.open(dialogRef, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        message: `Tem certeza que deseja remover o cliente ${this.customer().name}?`,
      },
    });
    refOpen.afterClosed().subscribe((result) => {
      if (result == true) {
        this.customerService.removerCustomer(this.customer().id);
        this.notify.showSuccess('Cliente removido com sucesso!');
      } else {
        this.customer().ativo = !this.customer().ativo;
      }
    });
  }
}

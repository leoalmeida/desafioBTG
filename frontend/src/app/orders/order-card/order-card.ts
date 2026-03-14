import { MatButtonModule } from '@angular/material/button';
import { Component, inject, input, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderItemType, OrderType } from '../order-type';
import { OrderService } from '../order.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { OrderItemDetails } from '../order-item-details/order-item-details';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from 'src/app/services/notification.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-card',
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
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard {
  order = input.required<OrderType>();
  private orderService: OrderService = inject(OrderService);
  message = '';

  private dialogAcao: MatDialog = inject(MatDialog);
  private notify: NotificationService = inject(NotificationService);

  constructor() { }

  onAddOrderItem(): void {
    const dialogRef = this.dialogAcao.open(OrderItemDetails, {
      width: '500px',
      data: {
        id: this.order().itemList.length > 0 ? Math.max(...this.order().itemList.map(i => i.id)) + 1 : 1  ,
        orderId: this.order().id,
        productName: '',
        quantity: 0,
        price: 0.0
      },
    });
    
    // Chama serviço para atualizar order após fechamento do diálogo
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.order().itemList.push(result);
        this.order().totalPrice = this.order().itemList.reduce((acc, item) => acc + (item.quantity * item.price), 0);
      }
    });
  }

  onUpdateOrderItem(orderItem: OrderItemType): void {
    const dialogRef = this.dialogAcao.open(OrderItemDetails, {
      width: '500px',
      data: { ...orderItem },
    });

    // Chama serviço para atualizar order após fechamento do diálogo
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const changed = this.order().itemList.findIndex(i => i.id === result.id);
        if (changed !== -1) {
          this.order().itemList[changed] = result;
          this.order().totalPrice = this.order().itemList.reduce((acc, item) => acc + (item.quantity * item.price), 0);
          this.notify.showSuccess('Atualização realizada com sucesso!');
        }
      }
    });
  }

  onRemoveOrderItem(orderItem: OrderItemType): void {
    const removed = this.order().itemList.findIndex(i => i.id === orderItem.id);
    if (removed !== -1) {
      this.order().itemList.splice(removed, 1);
      this.order().totalPrice = this.order().itemList.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    }
  }

  onSaveOrder(dialogRef: TemplateRef<any>): void {
    const refOpen = this.dialogAcao.open(dialogRef, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        message: `Tem certeza que deseja salvar o pedido?`,
      },
    });
    refOpen.afterClosed().subscribe((result) => {
      if (result == true) {
        if (this.order().id>=0) {
          this.orderService.changeOne(this.order()).subscribe({
            next: (updated) => {
              this.notify.showSuccess('Pedido atualizado com sucesso!');
            },
          });
        } else {
          this.orderService.createOne(this.order()).subscribe({
            next: (created) => {
              this.notify.showSuccess('Pedido criado com sucesso!');
            },
          });
        }
      }
    });
  }

  onRemoveOrder(dialogRef: TemplateRef<any>): void {
    const refOpen = this.dialogAcao.open(dialogRef, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        message: `Tem certeza que deseja remover o pedido ${this.order().id}?`,
      },
    });
    refOpen.afterClosed().subscribe((result) => {
      if (result == true) {
        this.orderService.removeOne(this.order().id);
      }
    });
  }
}

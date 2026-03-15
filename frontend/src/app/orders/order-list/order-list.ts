import { MatButtonModule } from "@angular/material/button";
import { Component, computed, inject, signal } from "@angular/core";
import { OrderService } from "../order.service";
import { LoadingService } from "../../core/loading-indicator/loading.service";
import { TokenStorageService } from "../../services/token-storage.service";
import { OrderCard } from "../order-card/order-card";
import { Searchbar } from "../../core/searchbar/searchbar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { UserType } from "src/app/users/user-type";
import { NotificationService } from "src/app/services/notification.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "app-order-list",
  standalone: true,
  imports: [
    OrderCard,
    Searchbar,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: "./order-list.html",
  styleUrls: ["./order-list.css"],
})
export class OrderList {
  protected loggedUser = signal({} as UserType);
  searchQuery = signal<string>("");

  private orderService: OrderService = inject(OrderService);
  private loadingService: LoadingService = inject(LoadingService);
  private tokenStorageService: TokenStorageService =
    inject(TokenStorageService);
  private notify: NotificationService = inject(NotificationService);

  constructor() {
    try {
      this.tokenStorageService.loggedUser$.subscribe((user) => {
        this.loggedUser.set(user);
      });
    } catch (error: any) {
      this.notify.showError(error.message || "Erro ao identificar usuário.");
    }
  }

  filteredOrderList = computed(() => {
    try {
      this.loadingService.loadingOn();
      const normalizedQuery = this.searchQuery()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return this.orderService
        .items()
        .filter((x) => x?.customerId.toString().includes(normalizedQuery));
    } catch (error: any) {
      this.notify.showError(error.message || "Erro ao filtrar benefícios.");
      return [];
    } finally {
      this.loadingService.loadingOff();
    }
  });

  handleMessage(message: string): void {
    this.searchQuery.set(message);
  }
}

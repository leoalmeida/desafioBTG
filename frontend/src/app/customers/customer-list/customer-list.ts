import { MatButtonModule } from "@angular/material/button";
import { Component, computed, inject, signal } from "@angular/core";
import { CustomerService } from "../customer.service";
import { LoadingService } from "../../core/loading-indicator/loading.service";
import { TokenStorageService } from "../../services/token-storage.service";
import { CustomerCard } from "../customer-card/customer-card";
import { Searchbar } from "../../core/searchbar/searchbar";
import { CustomerDetails } from "../customer-details/customer-details";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { UserType } from "src/app/users/user-type";
import { NotificationService } from "src/app/services/notification.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CustomerType } from "../customer-type";

@Component({
  selector: "app-customer-list",
  standalone: true,
  imports: [
    CustomerCard,
    Searchbar,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: "./customer-list.html",
  styleUrls: ["./customer-list.css"],
})
export class CustomerList {
  protected loggedUser = signal({} as UserType);
  searchQuery = signal<string>("");

  private customerService: CustomerService = inject(CustomerService);
  private loadingService: LoadingService = inject(LoadingService);
  private tokenStorageService: TokenStorageService =
    inject(TokenStorageService);
  private dialogAcao: MatDialog = inject(MatDialog);
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

  filteredCustomerList = computed(() => {
    try {
      this.loadingService.loadingOn();
      const normalizedQuery = this.searchQuery()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return this.customerService
        .items()
        .filter((x: CustomerType) =>
          x?.name.toLowerCase().includes(normalizedQuery),
        );
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

  onCreateCustomer(): void {
    const dialogRef = this.dialogAcao.open(CustomerDetails, {
      width: "500px",
      data: {},
    });
    // Mantem o fluxo de fechamento sem side effects de log.
    dialogRef.afterClosed().subscribe();
  }
}

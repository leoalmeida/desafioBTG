import { MatButtonModule } from '@angular/material/button';
import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { UserType } from 'src/app/users/user-type';
import { TitleService } from 'src/app/services/title.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerDetails } from '../../customers/customer-details/customer-details';
import { NotificationService } from 'src/app/services/notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { OrderService } from 'src/app/orders/order.service';
import { CustomerService } from 'src/app/customers/customer.service';
import { LoadingService } from '../loading-indicator/loading.service';
import { FormsModule } from '@angular/forms';

interface RouteInfo {
  path: string;
  descricao: string;
}
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    RouterLink,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './toolbar.html',
  styleUrls: ['./toolbar.css'],
})
export class Toolbar implements AfterViewInit {
  title = signal<string>(''); // Inicializa o título como uma string vazia
  routes: RouteInfo[] = [];
  opened = false;
  private tokenStorageService: TokenStorageService =
    inject(TokenStorageService);
  protected isLoggedIn = signal(false);
  protected loggedUser = signal({} as UserType);
  private titleService: TitleService = inject(TitleService);
  private router = inject(Router);
  private dialogAcao: MatDialog = inject(MatDialog);
  private notify: NotificationService = inject(NotificationService);
  private orderService: OrderService = inject(OrderService);
  private customerService: CustomerService = inject(CustomerService);
  private loadingService: LoadingService = inject(LoadingService);
  
  customers = this.customerService.items();
  selectedCustomerId: number = -1;
  constructor() {
    this.tokenStorageService.autenticado$.subscribe((isAuth) => {
      this.isLoggedIn.set(isAuth);
      if (isAuth) {        
        try {
          this.loadingService.loadingOn();
          this.customerService.getAll();
          this.orderService.getAll();
        } catch (error: any) {
          this.notify.showError(error.message || 'Erro ao identificar usuário.');
        } finally {
          this.loadingService.loadingOff();
        }
      }
    });
    this.tokenStorageService.loggedUser$.subscribe((user) => {
      this.loggedUser.set(user);
    });
    this.titleService.title$.subscribe((title) => {
      this.title.set(title);
    });
  }

  ngAfterViewInit(): void {
    // Fetch the routes from the router
    const routesConf = this.router.config;
    for (const route of routesConf) {
      if (route) {
        if (
          route.path !== '**' &&
          route.path !== 'login' &&
          route.path !== 'acesso-negado'
        ) {
          this.routes.push({
            path: route.path || '',
            descricao: route.data?.['title'] || '',
          });
        }
      }
    }
  }

  showMenu() { }

  onCustomerSelected(customerId: number): void {
    this.selectedCustomerId = customerId;
    this.orderService.filterByCustomer(customerId);
  }

  onCreateOrder(): void {
    if (this.selectedCustomerId >= 0) {
      const order = this.orderService.addOne(this.selectedCustomerId);
    }
  }

  onCreateCustomer(): void {
    const refOpen = this.dialogAcao.open(CustomerDetails, {
      width: '500px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {},
    });

    refOpen.afterClosed().subscribe((result) => {
      if (result) {
        this.notify.showSuccess('Cliente criado com sucesso!');
      }
    });
  }
}

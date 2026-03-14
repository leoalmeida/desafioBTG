import { MatButtonModule } from '@angular/material/button';
import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AssociadoType } from 'src/app/models/associado-type';
import { TitleService } from 'src/app/services/title.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BeneficioDetails } from '../beneficio-details/beneficio-details';
import { TransferDetails } from '../transfer-details/transfer-details';
import { NotificationService } from 'src/app/services/notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

interface RouteInfo {
  path: string;
  descricao: string;
}
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    RouterLink,
    MatSnackBarModule,
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
  protected loggedUser = signal({} as AssociadoType);
  private titleService: TitleService = inject(TitleService);
  private router = inject(Router);
  private dialogAcao: MatDialog = inject(MatDialog);
  private notify: NotificationService = inject(NotificationService);

  constructor() {
    this.tokenStorageService.autenticado$.subscribe((isAuth) => {
      this.isLoggedIn.set(isAuth);
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

  showMenu() {}

  onCreateBeneficio(): void {
    const dialogRef = this.dialogAcao.open(BeneficioDetails, {
      width: '500px',
      data: {},
    });
    // Chama serviço para criar beneficio após fechamento do diálogo
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notify.showSuccess('Benefício criado com sucesso!');
      }
    });
  }

  onRealizarTransferencia(): void {
    const refOpen = this.dialogAcao.open(TransferDetails, {
      width: '500px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {},
    });

    refOpen.afterClosed().subscribe((result) => {
      if (result) {
        this.notify.showSuccess('Transferência realizada com sucesso!');
      }
    });
  }
}

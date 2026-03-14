import { Routes } from '@angular/router';
import { BeneficioList } from './components/beneficio-list/beneficio-list';
import { LoginPage } from './components/login/login-page';
import { canActivateUser } from './guards/can-activate-user';
import { AdminBoard } from './components/admin-board/admin-board';
import { canActivateAdmin } from './guards/can-activate-admin';
import { HomePage } from './components/home-page/home-page';
import { AcessoNegado } from './components/acesso-negado/acesso-negado';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [canActivateUser],
    data: { title: 'Home' },
  },
  {
    path: 'admin',
    component: AdminBoard,
    canActivate: [canActivateAdmin],
    data: { title: 'Painel Administrativo' },
  },
  { path: 'login', component: LoginPage, data: { title: 'Autenticação' } },
  {
    path: 'acesso-negado',
    component: AcessoNegado,
    data: { title: 'Acesso Negado' },
  },
  {
    path: 'beneficios',
    component: BeneficioList,
    canActivate: [canActivateUser],
    data: { title: 'Gestão de Benefícios' },
  },
  { path: '**', redirectTo: '' },
];

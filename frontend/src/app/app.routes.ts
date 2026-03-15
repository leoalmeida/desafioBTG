import { Routes } from "@angular/router";
import { LoginPage } from "./login/login-page/login-page";
import { canActivateUser } from "./guards/can-activate-user";
import { AdminBoard } from "./admin/admin-board/admin-board";
import { canActivateAdmin } from "./guards/can-activate-admin";
import { HomePage } from "./core/home-page/home-page";
import { AcessoNegado } from "./core/acesso-negado/acesso-negado";
import { OrderList } from "./orders/order-list/order-list";
import { CustomerList } from "./customers/customer-list/customer-list";

export const routes: Routes = [
  {
    path: "",
    component: HomePage,
    canActivate: [canActivateUser],
    data: { title: "Home" },
  },
  {
    path: "admin",
    component: AdminBoard,
    canActivate: [canActivateAdmin],
    data: { title: "Painel Administrativo" },
  },
  { path: "login", component: LoginPage, data: { title: "Autenticação" } },
  {
    path: "acesso-negado",
    component: AcessoNegado,
    data: { title: "Acesso Negado" },
  },
  {
    path: "customers",
    component: CustomerList,
    canActivate: [canActivateUser],
    data: { title: "Gestão de Clientes" },
  },
  {
    path: "orders",
    component: OrderList,
    canActivate: [canActivateUser],
    data: { title: "Gestão de Pedidos" },
  },
  { path: "**", redirectTo: "" },
];

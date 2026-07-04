import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  {
    path: 'pages/product-detail',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'pages/payment',
    loadComponent: () => import('./pages/payment/payment').then((m) => m.Payment),
  },
  {
    path: 'pages/orders',
    loadComponent: () => import('./pages/orders/orders').then((m) => m.Orders),
  },
  {
    path: 'pages/orders-details',
    loadComponent: () => import('./pages/order-details/order-details').then((m) => m.OrderDetails),
  },
  { path: 'signin', loadComponent: () => import('./pages/signin/signin').then((m) => m.Signin) },
  { path: '**', redirectTo: '' },
];
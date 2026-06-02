import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
    { path: 'pages/product-detail', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
    { path: 'pages/payment', loadComponent: () => import('./pages/payment/payment').then(m => m.Payment) },
    { path: '**', redirectTo: '' }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./route/home/home').then((m) => m.Home),
  },
];

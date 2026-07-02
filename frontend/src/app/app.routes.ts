import { Routes } from '@angular/router';
import { isNotLoggedGuard } from '../core/guards/is-not-logged-guard';
import { isLoggedGuard } from '../core/guards/is-logged-guard';
import { canVoteGuard } from '../core/guards/can-vote-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [isNotLoggedGuard],
    loadComponent: () => import('./route/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/home/home').then((m) => m.Home),
  },
  {
    path: 'votar',
    canActivate: [isLoggedGuard, canVoteGuard],
    loadComponent: () => import('./route/votos/votos').then((m) => m.Vote),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

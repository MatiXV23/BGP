import { Routes } from '@angular/router';
import { isNotLoggedGuard } from '../core/guards/is-not-logged-guard';
import { isLoggedGuard } from '../core/guards/is-logged-guard';

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
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/votos/votos').then((m) => m.Vote),
  },
  {
    path: 'mesa',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/mesa/mesa').then((m) => m.Mesa),
  },
  {
    path: 'resultados',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/resultados/resultados').then((m) => m.Resultados),
  },
  {
    path: 'ciudadanos',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/ciudadanos/ciudadanos').then((m) => m.Ciudadanos),
  },
  {
    path: 'circuitos',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/circuitos/circuitos').then((m) => m.Circuitos),
  },
  {
    path: 'elecciones',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/elecciones/elecciones').then((m) => m.Elecciones),
  },
  {
    path: 'establecimientos',
    canActivate: [isLoggedGuard],
    loadComponent: () =>
      import('./route/establecimientos/establecimientos').then((m) => m.Establecimientos),
  },
  {
    path: 'departamentos',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/departamentos/departamentos').then((m) => m.Departamentos),
  },
  {
    path: 'seguridad',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/seguridad/seguridad').then((m) => m.Seguridad),
  },

  {
    path: 'reportes',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/reportes/reportes').then((m) => m.Reportes),
  },
  {
    path: 'configuracion',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./route/configuracion/configuracion').then((m) => m.Configuracion),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

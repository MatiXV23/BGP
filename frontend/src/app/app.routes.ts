import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./route/home/home').then((m) => m.Home),
  },
  {
    path: 'votar',
    loadComponent: () => import('./route/votos/votos').then((m) => m.Vote),
  },
  {
    path: 'mesa',
    loadComponent: () => import('./route/mesa/mesa').then((m) => m.Mesa),
  },
  {
    path: 'resultados',
    loadComponent: () => import('./route/resultados/resultados').then((m) => m.Resultados),
  },
  {
    path: 'ciudadanos',
    loadComponent: () => import('./route/ciudadanos/ciudadanos').then((m) => m.Ciudadanos),
  },
  {
    path: 'circuitos',
    loadComponent: () => import('./route/circuitos/circuitos').then((m) => m.Circuitos),
  },
  {
    path: 'elecciones',
    loadComponent: () => import('./route/elecciones/elecciones').then((m) => m.Elecciones),
  },
  {
    path: 'establecimientos',
    loadComponent: () =>
      import('./route/establecimientos/establecimientos').then((m) => m.Establecimientos),
  },
  {
    path: 'departamentos',
    loadComponent: () => import('./route/departamentos/departamentos').then((m) => m.Departamentos),
  },
];

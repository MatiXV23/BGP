import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MainStore } from '../../shared/stores/main.store';

// Ante cualquier 401 (token ausente, inválido o vencido) fuerza el logout y manda al login,
// salvo que el 401 venga del propio intento de login (ahí el error lo maneja el formulario).
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const mainStore = inject(MainStore);

  const esIntentoDeLogin = req.method === 'POST' && req.url.endsWith('/auth');

  return next(req).pipe(
    catchError((err) => {
      if (!esIntentoDeLogin && err instanceof HttpErrorResponse && err.status === 401) {
        mainStore.token.set(undefined);
        mainStore.user.set(undefined);
        localStorage.removeItem('token');
        if (router.url !== '/login') {
          router.navigateByUrl('/login');
        }
      }
      return throwError(() => err);
    }),
  );
};

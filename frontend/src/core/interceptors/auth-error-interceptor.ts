import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MainStore } from '../../shared/stores/main.store';

// Ante cualquier 401 (token ausente, inválido o vencido) fuerza el logout y manda al login.
// Las llamadas al propio endpoint /auth (login y checkLocalStorage) quedan afuera: esas ya
// manejan su propio error (el formulario de login, o el catch de checkLocalStorage + la guard
// de la ruta), y dejar que este interceptor navegue también generaba una carrera con la guard
// que estaba resolviendo esa misma navegación.
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const mainStore = inject(MainStore);

  const esLlamadaAuth = req.url.endsWith('/auth');

  return next(req).pipe(
    catchError((err) => {
      if (!esLlamadaAuth && err instanceof HttpErrorResponse && err.status === 401) {
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

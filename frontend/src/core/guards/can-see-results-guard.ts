import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MesaContextService } from '../../shared/services/mesa-context.service';

export const canSeeResultsGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const mesaContext = inject(MesaContextService);

  await mesaContext.refresh();

  return mesaContext.mesa()?.estado === 'Abierta' ? router.createUrlTree(['/']) : true;
};

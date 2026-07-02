import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MesaService } from '../../shared/services/mesa.service';

export const canVoteGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const mesaService = inject(MesaService);

  try {
    const mesa = await mesaService.getMiaVotacion();
    return mesa.estado === 'Cerrada' ? router.createUrlTree(['/']) : true;
  } catch {
    // Si no está habilitado para votar en ningún circuito (u otro error), lo dejamos entrar:
    // la propia pantalla de votar muestra el estado correspondiente.
    return true;
  }
};

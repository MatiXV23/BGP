import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { MesaService } from './mesa.service';
import type { MesaActual } from '../types/mesa-actual';

@Injectable({ providedIn: 'root' })
export class MesaContextService {
  private mesaService = inject(MesaService);

  mesa = signal<MesaActual | undefined>(undefined);
  loading = signal(false);
  loaded = signal(false);
  error = signal<string | null>(null);

  async refresh(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      this.mesa.set(await this.mesaService.getMia());
    } catch (e) {
      if (!(e instanceof HttpErrorResponse) || e.status !== 404) {
        this.error.set('No se pudo cargar la información de la mesa');
      } else {
        // No integra la autoridad de ninguna mesa: si igual está habilitado para votar en
        // algún circuito, mostramos esa mesa (así el panel principal y el topbar no quedan
        // vacíos para un usuario que solo es votante).
        try {
          this.mesa.set(await this.mesaService.getMiaVotacion());
        } catch {
          this.mesa.set(undefined);
        }
      }
    } finally {
      this.loading.set(false);
      this.loaded.set(true);
    }
  }

  clear(): void {
    this.mesa.set(undefined);
    this.loading.set(false);
    this.loaded.set(false);
    this.error.set(null);
  }

  async cerrarMesa(): Promise<void> {
    const mesa = this.mesa();
    if (!mesa) return;

    await this.mesaService.cerrar(mesa.id_mesa);
    await this.refresh();
  }
}

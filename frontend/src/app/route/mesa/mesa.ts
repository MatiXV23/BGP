import { Component, inject } from '@angular/core';
import { MainStore } from '../../../shared/stores/main.store';
import { MesaContextService } from '../../../shared/services/mesa-context.service';

@Component({
  selector: 'app-mesa',
  imports: [],
  templateUrl: './mesa.html',
  styleUrl: './mesa.css',
})
export class Mesa {
  protected readonly mainStore = inject(MainStore);
  protected readonly mesaContext = inject(MesaContextService);

  protected cerrando = false;

  async cerrarMesa(): Promise<void> {
    if (this.cerrando) return;

    const confirmar = confirm(
      '¿Confirmás el cierre de la mesa? Esta acción no se podrá deshacer.',
    );
    if (!confirmar) return;

    this.cerrando = true;
    try {
      await this.mesaContext.cerrarMesa();
    } catch {
      alert('No se pudo cerrar la mesa.');
    } finally {
      this.cerrando = false;
    }
  }
}

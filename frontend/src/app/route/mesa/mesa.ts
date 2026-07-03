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

  participacionPct(): number {
    const mesa = this.mesaContext.mesa();

    if (!mesa || mesa.habilitados === 0) {
      return 0;
    }

    return Math.round((mesa.votos_emitidos / mesa.habilitados) * 1000) / 10;
  }

  iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join('');
  }

  async recargarMesa(): Promise<void> {
    await this.mesaContext.refresh();
  }

  async cerrarMesa(): Promise<void> {
    if (this.cerrando) return;

    const confirmar = confirm('¿Confirmás el cierre de la mesa? Esta acción no se podrá deshacer.');

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

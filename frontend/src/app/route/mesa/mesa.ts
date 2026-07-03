import { Component, inject, signal } from '@angular/core';
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

  // Modal de confirmación propio (en vez de confirm()/alert() nativos), para que se vea
  // igual en todos los navegadores en lugar de depender del diálogo del navegador.
  protected readonly confirmMensaje = signal<string | null>(null);
  private confirmAccion: (() => void) | null = null;

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

  cerrarMesa(): void {
    if (this.cerrando) return;

    this.pedirConfirmacion(
      '¿Confirmás el cierre de la mesa? Esta acción no se podrá deshacer.',
      () => this.confirmarCierreMesa(),
    );
  }

  private async confirmarCierreMesa(): Promise<void> {
    this.cerrando = true;

    try {
      await this.mesaContext.cerrarMesa();
    } catch {
      alert('No se pudo cerrar la mesa.');
    } finally {
      this.cerrando = false;
    }
  }

  private pedirConfirmacion(mensaje: string, onConfirm: () => void): void {
    this.confirmMensaje.set(mensaje);
    this.confirmAccion = onConfirm;
  }

  protected confirmarAccion(): void {
    const accion = this.confirmAccion;
    this.cerrarConfirmacion();
    accion?.();
  }

  protected cerrarConfirmacion(): void {
    this.confirmMensaje.set(null);
    this.confirmAccion = null;
  }
}

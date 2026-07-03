import { Component, computed, inject, signal } from '@angular/core';
import { MesaContextService } from '../../../shared/services/mesa-context.service';
import type { PapeletaResultado } from '../../../shared/types/mesa-actual';

@Component({
  selector: 'app-resultados',
  imports: [],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados {
  readonly mesaContext = inject(MesaContextService);

  private readonly tabSeleccionado = signal<string | null>(null);

  readonly mesa = computed(() => this.mesaContext.mesa());

  readonly mesaCerrada = computed(() => this.mesa()?.estado === 'Cerrada');

  readonly categorias = computed(() => {
    const mesa = this.mesa();
    if (!mesa) return [];

    return Array.from(
      new Set(mesa.papeletas.map((papeleta) => papeleta.organo_candidatura ?? 'General')),
    );
  });

  readonly tabActivo = computed(() => {
    return this.tabSeleccionado() ?? this.categorias()[0] ?? '';
  });

  readonly papeletasFiltradas = computed<PapeletaResultado[]>(() => {
    const mesa = this.mesa();
    if (!mesa) return [];

    const tab = this.tabActivo();

    return mesa.papeletas.filter((papeleta) => (papeleta.organo_candidatura ?? 'General') === tab);
  });

  readonly totalVotosTab = computed(() => {
    return this.papeletasFiltradas().reduce((total, papeleta) => total + papeleta.votos, 0);
  });

  readonly participacionPct = computed(() => {
    const mesa = this.mesa();

    if (!mesa || mesa.habilitados === 0) {
      return 0;
    }

    return Math.round((mesa.votos_emitidos / mesa.habilitados) * 1000) / 10;
  });

  seleccionarTab(tab: string): void {
    this.tabSeleccionado.set(tab);
  }

  porcentaje(votos: number): number {
    const total = this.totalVotosTab();

    if (total === 0) {
      return 0;
    }

    return Math.round((votos / total) * 1000) / 10;
  }

  async recargarMesa(): Promise<void> {
    await this.mesaContext.refresh();
  }
}

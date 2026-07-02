import { Component, computed, inject, signal } from '@angular/core';
import { MesaContextService } from '../../../shared/services/mesa-context.service';
import type { PapeletaResultado } from '../../../shared/types/mesa-actual';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly mesaContext = inject(MesaContextService);

  private readonly tabSeleccionado = signal<string | null>(null);

  protected readonly categorias = computed(() => {
    const mesa = this.mesaContext.mesa();
    if (!mesa) return [];
    return Array.from(new Set(mesa.papeletas.map((p) => p.organo_candidatura ?? 'General')));
  });

  protected readonly tabActivo = computed(() => this.tabSeleccionado() ?? this.categorias()[0] ?? '');

  protected readonly papeletasFiltradas = computed<PapeletaResultado[]>(() => {
    const mesa = this.mesaContext.mesa();
    if (!mesa) return [];
    const tab = this.tabActivo();
    return mesa.papeletas.filter((p) => (p.organo_candidatura ?? 'General') === tab);
  });

  protected readonly totalVotosTab = computed(() =>
    this.papeletasFiltradas().reduce((acc, p) => acc + p.votos, 0),
  );

  protected readonly participacionPct = computed(() => {
    const mesa = this.mesaContext.mesa();
    if (!mesa || mesa.habilitados === 0) return 0;
    return Math.round((mesa.votos_emitidos / mesa.habilitados) * 1000) / 10;
  });

  seleccionarTab(tab: string): void {
    this.tabSeleccionado.set(tab);
  }

  porcentaje(votos: number): number {
    const total = this.totalVotosTab();
    if (total === 0) return 0;
    return Math.round((votos / total) * 1000) / 10;
  }

  iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join('');
  }
}

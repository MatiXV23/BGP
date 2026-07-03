import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainStore } from '../../../shared/stores/main.store';
import { MesaService } from '../../../shared/services/mesa.service';
import type {
  MesaActual,
  PapeletaResultado,
  VerificacionVotante,
  VotoEmitido,
} from '../../../shared/types/mesa-actual';

type GrupoPapeletas = {
  organo: string;
  papeletas: PapeletaResultado[];
};

@Component({
  selector: 'app-votos',
  imports: [FormsModule],
  templateUrl: './votos.html',
  styleUrl: './votos.css',
})
export class Vote implements OnInit {
  protected readonly mainStore = inject(MainStore);
  private mesaService = inject(MesaService);

  protected readonly cargando = signal(true);
  protected readonly mesaVotacion = signal<MesaActual | null>(null);
  protected readonly errorMesa = signal<string | null>(null);

  // Precompletado con el circuito de mi mesa de votación; editable por si hay que corregirlo.
  circuitoIngresado = '';

  protected readonly verificando = signal(false);
  protected readonly verificacion = signal<VerificacionVotante | null>(null);
  protected readonly errorVerificacion = signal<string | null>(null);

  protected readonly emitiendo = signal(false);
  protected readonly errorEmision = signal<string | null>(null);
  protected readonly votoConfirmado = signal<VotoEmitido | null>(null);

  protected readonly mostrarConfirmacionSobrevoto = signal(false);

  papeletasSeleccionadas = new Set<number>();

  async ngOnInit(): Promise<void> {
    await this.cargarMesaVotacion();
  }

  private async cargarMesaVotacion(): Promise<void> {
    this.cargando.set(true);
    this.errorMesa.set(null);

    try {
      const mesa = await this.mesaService.getMiaVotacion();
      this.mesaVotacion.set(mesa);
      this.circuitoIngresado = mesa.numero_circuito;
    } catch (e) {
      this.errorMesa.set(
        e instanceof HttpErrorResponse && e.status === 404
          ? 'No estás habilitado para votar en ningún circuito.'
          : 'No se pudo cargar la información de tu mesa de votación.',
      );
    } finally {
      this.cargando.set(false);
    }
  }

  protected get mesaAbierta(): boolean {
    return this.mesaVotacion()?.estado === 'Abierta';
  }

  protected get puedeVotar(): boolean {
    const v = this.verificacion();
    return this.mesaAbierta && !!v && !v.ya_voto;
  }

  alternarPapeleta(idPapeleta: number): void {
    if (!this.puedeVotar) return;

    if (this.papeletasSeleccionadas.has(idPapeleta)) {
      this.papeletasSeleccionadas.delete(idPapeleta);
    } else {
      this.papeletasSeleccionadas.add(idPapeleta);
    }
  }

  estaSeleccionada(idPapeleta: number): boolean {
    return this.papeletasSeleccionadas.has(idPapeleta);
  }

  // Agrupa las papeletas por organismo/cargo (organo_candidatura), usando el tipo de
  // elección como nombre del cargo principal cuando organo_candidatura es null
  // (ej: la fórmula presidencial o el candidato a intendente).
  gruposPapeletas(): GrupoPapeletas[] {
    const mesa = this.mesaVotacion();
    if (!mesa) return [];

    const grupos = new Map<string, PapeletaResultado[]>();
    for (const papeleta of mesa.papeletas) {
      const organo = papeleta.organo_candidatura ?? mesa.eleccion_tipo;
      if (!grupos.has(organo)) grupos.set(organo, []);
      grupos.get(organo)!.push(papeleta);
    }

    return Array.from(grupos.entries()).map(([organo, papeletas]) => ({ organo, papeletas }));
  }

  // Organismos para los que se seleccionó más de una papeleta: ese sobrevoto anula el voto.
  gruposConSobrevoto(): string[] {
    const mesa = this.mesaVotacion();
    if (!mesa) return [];

    const conteo = new Map<string, number>();
    for (const papeleta of mesa.papeletas) {
      if (!this.papeletasSeleccionadas.has(papeleta.id_papeleta)) continue;
      const organo = papeleta.organo_candidatura ?? mesa.eleccion_tipo;
      conteo.set(organo, (conteo.get(organo) ?? 0) + 1);
    }

    return Array.from(conteo.entries())
      .filter(([, cantidad]) => cantidad > 1)
      .map(([organo]) => organo);
  }

  grupoConSobrevoto(organo: string): boolean {
    return this.gruposConSobrevoto().includes(organo);
  }

  limpiarSeleccion(): void {
    this.papeletasSeleccionadas.clear();
  }

  cantidadSeleccionadas(): number {
    return this.papeletasSeleccionadas.size;
  }

  async verificarVotante(): Promise<void> {
    if (!this.mesaAbierta || !this.circuitoIngresado.trim()) return;

    this.verificando.set(true);
    this.errorVerificacion.set(null);
    this.verificacion.set(null);
    this.votoConfirmado.set(null);
    this.limpiarSeleccion();

    try {
      this.verificacion.set(await this.mesaService.verificarVotante(this.circuitoIngresado.trim()));
    } catch (e) {
      this.errorVerificacion.set(this.mensajeError(e, 'No se pudo verificar tu habilitación para votar'));
    } finally {
      this.verificando.set(false);
    }
  }

  onClickEmitirVoto(): void {
    if (this.gruposConSobrevoto().length > 0) {
      this.mostrarConfirmacionSobrevoto.set(true);
      return;
    }
    void this.emitirVoto();
  }

  confirmarVotoConSobrevoto(): void {
    this.mostrarConfirmacionSobrevoto.set(false);
    void this.emitirVoto();
  }

  cancelarConfirmacionSobrevoto(): void {
    this.mostrarConfirmacionSobrevoto.set(false);
  }

  private async emitirVoto(): Promise<void> {
    await this.registrarVoto(Array.from(this.papeletasSeleccionadas));
  }

  async votarEnBlanco(): Promise<void> {
    await this.registrarVoto([]);
  }

  private async registrarVoto(idPapeletas: number[]): Promise<void> {
    if (!this.puedeVotar || this.emitiendo()) return;

    this.emitiendo.set(true);
    this.errorEmision.set(null);

    try {
      const resultado = await this.mesaService.emitirVoto(this.circuitoIngresado.trim(), idPapeletas);

      this.votoConfirmado.set(resultado);
      this.verificacion.set(null);
      this.limpiarSeleccion();

      await this.cargarMesaVotacion();
    } catch (e) {
      this.errorEmision.set(this.mensajeError(e, 'No se pudo emitir el voto'));
    } finally {
      this.emitiendo.set(false);
    }
  }

  private mensajeError(e: unknown, fallback: string): string {
    if (e instanceof HttpErrorResponse && typeof e.error?.message === 'string') {
      return e.error.message;
    }
    return fallback;
  }
}

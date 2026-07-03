import { Component, OnInit, inject, signal } from '@angular/core';
import { EleccionService } from '../../../shared/services/elecciones.service';
import type { Eleccion, ResultadoPapeleta, ResultadosEleccion } from '../../../shared/types/electoral';

@Component({
  selector: 'app-elecciones',
  imports: [],
  templateUrl: './elecciones.html',
  styleUrl: './elecciones.css',
})
export class Elecciones implements OnInit {
  private eleccionService = inject(EleccionService);

  protected readonly cargandoElecciones = signal(true);
  protected readonly elecciones = signal<Eleccion[]>([]);
  protected readonly errorElecciones = signal<string | null>(null);

  protected readonly eleccionSeleccionada = signal<Eleccion | null>(null);

  protected readonly cargandoResultados = signal(false);
  protected readonly resultados = signal<ResultadosEleccion | null>(null);
  protected readonly errorResultados = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    this.cargandoElecciones.set(true);
    this.errorElecciones.set(null);

    try {
      const elecciones = await this.eleccionService.getAll();
      this.elecciones.set(elecciones);

      if (elecciones.length > 0) {
        await this.seleccionarEleccion(elecciones[0]);
      }
    } catch {
      this.errorElecciones.set('No se pudieron cargar las elecciones.');
    } finally {
      this.cargandoElecciones.set(false);
    }
  }

  async seleccionarEleccion(eleccion: Eleccion): Promise<void> {
    this.eleccionSeleccionada.set(eleccion);
    this.cargandoResultados.set(true);
    this.errorResultados.set(null);
    this.resultados.set(null);

    try {
      this.resultados.set(await this.eleccionService.getResultados(eleccion.id_eleccion));
    } catch {
      this.errorResultados.set('No se pudieron cargar los resultados de esta elección.');
    } finally {
      this.cargandoResultados.set(false);
    }
  }

  etiquetaPapeleta(p: ResultadoPapeleta): string {
    const partes = [p.numero_lista ? `Lista ${p.numero_lista}` : null, p.papeleta, p.partido];
    return partes.filter(Boolean).join(' · ');
  }

  etiquetaEleccion(eleccion: Eleccion): string {
    return `${eleccion.fecha} — ${eleccion.descripcion ?? `Elección #${eleccion.id_eleccion}`}`;
  }

  async cargarDatos(): Promise<void> {
    this.cargando = true;
    this.errorCarga = '';
    this.cdr.detectChanges();

    try {
      const [elecciones, tiposEleccion] = await Promise.all([
        this.eleccionService.getAll(),
        this.tiposEleccionService.getAll(),
      ]);

      this.elecciones = elecciones;
      this.tiposEleccion = tiposEleccion;
      this.aplicarFiltros();
    } catch (error) {
      console.error('Error al cargar elecciones', error);
      this.errorCarga = 'No se pudieron cargar las elecciones desde el backend.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  actualizarBusqueda(valor: string): void {
    this.busqueda = valor.trim().toLowerCase();
    this.aplicarFiltros();
  }

  actualizarTipo(valor: string): void {
    this.tipoSeleccionado = valor;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.eleccionesFiltradas = this.elecciones.filter((eleccion) => {
      const tipo = this.obtenerNombreTipo(eleccion.id_tipo).toLowerCase();

      const coincideBusqueda =
        !this.busqueda ||
        eleccion.fecha.toLowerCase().includes(this.busqueda) ||
        (eleccion.descripcion ?? '').toLowerCase().includes(this.busqueda) ||
        tipo.includes(this.busqueda) ||
        String(eleccion.id_eleccion).includes(this.busqueda);

      const coincideTipo =
        !this.tipoSeleccionado || String(eleccion.id_tipo) === this.tipoSeleccionado;

      return coincideBusqueda && coincideTipo;
    });
  }

  obtenerNombreTipo(idTipo: number): string {
    const tipo = this.tiposEleccion.find((t) => t.id_tipo === idTipo);
    return tipo?.nombre ?? `Tipo ${idTipo}`;
  }

  obtenerEleccionPrincipal(): Eleccion | null {
    if (this.elecciones.length === 0) {
      return null;
    }

    return [...this.elecciones].sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
  }
}

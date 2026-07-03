import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { EleccionService } from '../../../shared/services/elecciones.service';
import { TiposEleccionService } from '../../../shared/services/tipos-eleccion.service';
import type { Eleccion, TipoEleccion } from '../../../shared/types/electoral';

@Component({
  selector: 'app-elecciones',
  imports: [],
  templateUrl: './elecciones.html',
  styleUrl: './elecciones.css',
})
export class Elecciones implements OnInit {
  private readonly eleccionService = inject(EleccionService);
  private readonly tiposEleccionService = inject(TiposEleccionService);
  private readonly cdr = inject(ChangeDetectorRef);

  mostrarFormulario = false;

  elecciones: Eleccion[] = [];
  eleccionesFiltradas: Eleccion[] = [];
  tiposEleccion: TipoEleccion[] = [];

  busqueda = '';
  tipoSeleccionado = '';

  cargando = false;
  errorCarga = '';

  ngOnInit(): void {
    void this.cargarDatos();
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
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

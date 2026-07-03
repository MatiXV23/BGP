import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { PapeletaService } from '../../../shared/services/papeleta.service';
import { PartidoPoliticoService } from '../../../shared/services/partido-politico.service';
import { EleccionService } from '../../../shared/services/elecciones.service';
import { DepartamentosService } from '../../../shared/services/departamentos.service';
import type {
  Departamento,
  Eleccion,
  Papeleta,
  PartidoPolitico,
} from '../../../shared/types/electoral';

@Component({
  selector: 'app-papeletas',
  imports: [],
  templateUrl: './papeletas.html',
  styleUrl: './papeletas.css',
})
export class Papeletas implements OnInit {
  private readonly papeletaService = inject(PapeletaService);
  private readonly partidoPoliticoService = inject(PartidoPoliticoService);
  private readonly eleccionService = inject(EleccionService);
  private readonly departamentosService = inject(DepartamentosService);
  private readonly cdr = inject(ChangeDetectorRef);

  mostrarFormulario = false;

  papeletas: Papeleta[] = [];
  papeletasFiltradas: Papeleta[] = [];

  partidos: PartidoPolitico[] = [];
  elecciones: Eleccion[] = [];
  departamentos: Departamento[] = [];

  busqueda = '';
  eleccionSeleccionada = '';

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
      const [papeletas, partidos, elecciones, departamentos] = await Promise.all([
        this.papeletaService.getAll(),
        this.partidoPoliticoService.getAll(),
        this.eleccionService.getAll(),
        this.departamentosService.getAll(),
      ]);

      this.papeletas = papeletas;
      this.partidos = partidos;
      this.elecciones = elecciones;
      this.departamentos = departamentos;

      this.aplicarFiltros();
    } catch (error) {
      console.error('Error al cargar papeletas', error);
      this.errorCarga = 'No se pudieron cargar las papeletas desde el backend.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  actualizarBusqueda(valor: string): void {
    this.busqueda = valor.trim().toLowerCase();
    this.aplicarFiltros();
  }

  actualizarEleccion(valor: string): void {
    this.eleccionSeleccionada = valor;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.papeletasFiltradas = this.papeletas.filter((papeleta) => {
      const partido = this.obtenerNombrePartido(papeleta.id_partido).toLowerCase();
      const departamento = this.obtenerNombreDepartamento(papeleta.id_departamento).toLowerCase();
      const eleccion = this.obtenerDescripcionEleccion(papeleta.id_eleccion).toLowerCase();

      const coincideBusqueda =
        !this.busqueda ||
        String(papeleta.id_papeleta).includes(this.busqueda) ||
        String(papeleta.numero_lista ?? '').includes(this.busqueda) ||
        (papeleta.descripcion ?? '').toLowerCase().includes(this.busqueda) ||
        (papeleta.organo_candidatura ?? '').toLowerCase().includes(this.busqueda) ||
        partido.includes(this.busqueda) ||
        departamento.includes(this.busqueda) ||
        eleccion.includes(this.busqueda);

      const coincideEleccion =
        !this.eleccionSeleccionada || String(papeleta.id_eleccion) === this.eleccionSeleccionada;

      return coincideBusqueda && coincideEleccion;
    });
  }

  obtenerNombrePartido(idPartido?: number): string {
    if (!idPartido) {
      return 'Sin partido';
    }

    const partido = this.partidos.find((p) => p.id_partido === idPartido);
    return partido?.nombre ?? `Partido ${idPartido}`;
  }

  obtenerNombreDepartamento(idDepartamento?: number): string {
    if (!idDepartamento) {
      return 'Nacional';
    }

    const departamento = this.departamentos.find((d) => d.id_departamento === idDepartamento);

    return departamento?.nombre ?? `Departamento ${idDepartamento}`;
  }

  obtenerDescripcionEleccion(idEleccion: number): string {
    const eleccion = this.elecciones.find((e) => e.id_eleccion === idEleccion);

    if (!eleccion) {
      return `Elección ${idEleccion}`;
    }

    return eleccion.descripcion || `Elección ${idEleccion}`;
  }
}

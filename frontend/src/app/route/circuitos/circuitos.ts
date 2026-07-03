import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CircuitosService } from '../../../shared/services/circuitos.service';
import type { Circuito } from '../../../shared/types/electoral';

@Component({
  selector: 'app-circuitos',
  imports: [],
  templateUrl: './circuitos.html',
  styleUrl: './circuitos.css',
})
export class Circuitos implements OnInit {
  private readonly circuitosService = inject(CircuitosService);
  private readonly cdr = inject(ChangeDetectorRef);

  mostrarFormulario = false;

  circuitos: Circuito[] = [];
  circuitosFiltrados: Circuito[] = [];

  busqueda = '';
  cargando = false;
  errorCarga = '';

  ngOnInit(): void {
    void this.cargarCircuitos();
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  async cargarCircuitos(): Promise<void> {
    this.cargando = true;
    this.errorCarga = '';
    this.cdr.detectChanges();

    try {
      this.circuitos = await this.circuitosService.getAll();
      this.circuitosFiltrados = [...this.circuitos];
    } catch (error) {
      console.error('Error al cargar circuitos', error);
      this.errorCarga = 'No se pudieron cargar los circuitos desde el backend.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  actualizarBusqueda(valor: string): void {
    this.busqueda = valor.trim().toLowerCase();

    if (!this.busqueda) {
      this.circuitosFiltrados = [...this.circuitos];
      return;
    }

    this.circuitosFiltrados = this.circuitos.filter((circuito) => {
      return (
        circuito.numero.toLowerCase().includes(this.busqueda) ||
        circuito.localidad.toLowerCase().includes(this.busqueda) ||
        (circuito.barrio_zona ?? '').toLowerCase().includes(this.busqueda) ||
        String(circuito.id_departamento).includes(this.busqueda) ||
        String(circuito.id_establecimiento).includes(this.busqueda)
      );
    });
  }
}

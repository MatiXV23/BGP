import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { EstablecimientosService } from '../../../shared/services/establecimientos.service';
import type { Establecimiento } from '../../../shared/types/electoral';

@Component({
  selector: 'app-establecimientos',
  imports: [],
  templateUrl: './establecimientos.html',
  styleUrl: './establecimientos.css',
})
export class Establecimientos implements OnInit {
  private readonly establecimientosService = inject(EstablecimientosService);
  private readonly cdr = inject(ChangeDetectorRef);

  mostrarFormulario = false;

  establecimientos: Establecimiento[] = [];
  establecimientosFiltrados: Establecimiento[] = [];

  busqueda = '';
  cargando = false;
  errorCarga = '';

  ngOnInit(): void {
    void this.cargarEstablecimientos();
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  async cargarEstablecimientos(): Promise<void> {
    this.cargando = true;
    this.errorCarga = '';
    this.cdr.detectChanges();

    try {
      this.establecimientos = await this.establecimientosService.getAll();
      this.establecimientosFiltrados = [...this.establecimientos];
    } catch (error) {
      console.error('Error al cargar establecimientos', error);
      this.errorCarga = 'No se pudieron cargar los establecimientos desde el backend.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  actualizarBusqueda(valor: string): void {
    this.busqueda = valor.trim().toLowerCase();

    if (!this.busqueda) {
      this.establecimientosFiltrados = this.establecimientos;
      return;
    }

    this.establecimientosFiltrados = this.establecimientos.filter((establecimiento) => {
      return (
        establecimiento.nombre.toLowerCase().includes(this.busqueda) ||
        establecimiento.tipo.toLowerCase().includes(this.busqueda) ||
        String(establecimiento.id_zona).includes(this.busqueda)
      );
    });
  }
}

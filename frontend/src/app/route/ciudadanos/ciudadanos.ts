import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CiudadanosService } from '../../../shared/services/ciudadanos.service';
import type { Ciudadano } from '../../../shared/types/electoral';

@Component({
  selector: 'app-ciudadanos',
  imports: [],
  templateUrl: './ciudadanos.html',
  styleUrl: './ciudadanos.css',
})
export class Ciudadanos implements OnInit {
  private readonly ciudadanosService = inject(CiudadanosService);
  private readonly cdr = inject(ChangeDetectorRef);

  mostrarFormulario = false;

  ciudadanos: Ciudadano[] = [];
  ciudadanosFiltrados: Ciudadano[] = [];

  busqueda = '';
  cargando = false;
  errorCarga = '';

  ngOnInit(): void {
    void this.cargarCiudadanos();
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  async cargarCiudadanos(): Promise<void> {
    this.cargando = true;
    this.errorCarga = '';
    this.cdr.detectChanges();

    try {
      this.ciudadanos = await this.ciudadanosService.getAll();
      this.ciudadanosFiltrados = [...this.ciudadanos];
    } catch (error) {
      console.error('Error al cargar ciudadanos', error);
      this.errorCarga = 'No se pudieron cargar los ciudadanos desde el backend.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  actualizarBusqueda(valor: string): void {
    this.busqueda = valor.trim().toLowerCase();

    if (!this.busqueda) {
      this.ciudadanosFiltrados = [...this.ciudadanos];
      return;
    }

    this.ciudadanosFiltrados = this.ciudadanos.filter((ciudadano) => {
      return (
        ciudadano.cedula_identidad.toLowerCase().includes(this.busqueda) ||
        ciudadano.credencial_civica.toLowerCase().includes(this.busqueda) ||
        ciudadano.nombre_completo.toLowerCase().includes(this.busqueda)
      );
    });
  }
}

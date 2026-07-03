import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CiudadanosService } from '../../../shared/services/ciudadanos.service';
import type { Ciudadano } from '../../../shared/types/electoral';

@Component({
  selector: 'app-ciudadanos',
  imports: [FormsModule],
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
  guardando = false;

  errorCarga = '';
  errorFormulario = '';
  mensajeExito = '';

  nuevoCiudadano: Ciudadano = this.crearFormularioVacio();

  ngOnInit(): void {
    void this.cargarCiudadanos();
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.errorFormulario = '';
    this.mensajeExito = '';

    if (this.mostrarFormulario) {
      this.nuevoCiudadano = this.crearFormularioVacio();
    }
  }

  async cargarCiudadanos(): Promise<void> {
    this.cargando = true;
    this.errorCarga = '';
    this.cdr.detectChanges();

    try {
      this.ciudadanos = await this.ciudadanosService.getAll();
      this.aplicarFiltro();
    } catch (error) {
      console.error('Error al cargar ciudadanos:', error);
      this.errorCarga = 'No se pudieron cargar los ciudadanos desde el backend.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  async guardarCiudadano(): Promise<void> {
    if (this.guardando) return;

    this.errorFormulario = '';
    this.mensajeExito = '';

    const ciudadano: Ciudadano = {
      cedula_identidad: this.nuevoCiudadano.cedula_identidad.trim(),
      credencial_civica: this.nuevoCiudadano.credencial_civica.trim().toUpperCase(),
      nombre_completo: this.nuevoCiudadano.nombre_completo.trim(),
      fecha_nacimiento: this.nuevoCiudadano.fecha_nacimiento,
    };

    if (!this.validarFormulario(ciudadano)) {
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    try {
      await this.ciudadanosService.create(ciudadano);

      this.mensajeExito = 'Ciudadano guardado correctamente.';
      this.nuevoCiudadano = this.crearFormularioVacio();
      this.mostrarFormulario = false;

      await this.cargarCiudadanos();
    } catch (error: any) {
      console.error('Error al guardar ciudadano:', error);

      if (error?.status === 401 || error?.status === 403) {
        this.errorFormulario =
          'No tenés permisos para crear ciudadanos. Iniciá sesión como administrador.';
      } else if (error?.error?.message) {
        this.errorFormulario = error.error.message;
      } else {
        this.errorFormulario = 'No se pudo guardar el ciudadano.';
      }
    } finally {
      this.guardando = false;
      this.cdr.detectChanges();
    }
  }

  actualizarBusqueda(valor: string): void {
    this.busqueda = valor;
    this.aplicarFiltro();
  }

  private aplicarFiltro(): void {
    const texto = this.busqueda.trim().toLowerCase();

    if (!texto) {
      this.ciudadanosFiltrados = [...this.ciudadanos];
      return;
    }

    this.ciudadanosFiltrados = this.ciudadanos.filter((ciudadano) => {
      return (
        ciudadano.cedula_identidad.toLowerCase().includes(texto) ||
        ciudadano.credencial_civica.toLowerCase().includes(texto) ||
        ciudadano.nombre_completo.toLowerCase().includes(texto)
      );
    });
  }

  private validarFormulario(ciudadano: Ciudadano): boolean {
    if (
      !ciudadano.cedula_identidad ||
      !ciudadano.credencial_civica ||
      !ciudadano.nombre_completo ||
      !ciudadano.fecha_nacimiento
    ) {
      this.errorFormulario = 'Completá todos los campos antes de guardar.';
      return false;
    }

    if (ciudadano.cedula_identidad.length > 8) {
      this.errorFormulario = 'La cédula no puede tener más de 8 caracteres.';
      return false;
    }

    if (ciudadano.credencial_civica.length > 10) {
      this.errorFormulario = 'La credencial cívica no puede tener más de 10 caracteres.';
      return false;
    }

    return true;
  }

  private crearFormularioVacio(): Ciudadano {
    return {
      cedula_identidad: '',
      credencial_civica: '',
      nombre_completo: '',
      fecha_nacimiento: '',
    };
  }
}

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DepartamentosService } from '../../../shared/services/departamentos.service';
import type { Departamento } from '../../../shared/types/electoral';

@Component({
  selector: 'app-departamentos',
  imports: [],
  templateUrl: './departamentos.html',
  styleUrl: './departamentos.css',
})
export class Departamentos implements OnInit {
  private readonly departamentosService = inject(DepartamentosService);
  private readonly cdr = inject(ChangeDetectorRef);

  mostrarFormulario = false;

  departamentos: Departamento[] = [];
  departamentosFiltrados: Departamento[] = [];

  busqueda = '';
  cargando = false;
  errorCarga = '';

  ngOnInit(): void {
    void this.cargarDepartamentos();
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  async cargarDepartamentos(): Promise<void> {
    this.cargando = true;
    this.errorCarga = '';
    this.cdr.detectChanges();

    try {
      this.departamentos = await this.departamentosService.getAll();
      this.departamentosFiltrados = [...this.departamentos];
    } catch (error) {
      console.error('Error al cargar departamentos', error);
      this.errorCarga = 'No se pudieron cargar los departamentos desde el backend.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  actualizarBusqueda(valor: string): void {
    this.busqueda = valor.trim().toLowerCase();

    if (!this.busqueda) {
      this.departamentosFiltrados = this.departamentos;
      return;
    }

    this.departamentosFiltrados = this.departamentos.filter((departamento) =>
      departamento.nombre.toLowerCase().includes(this.busqueda),
    );
  }
}

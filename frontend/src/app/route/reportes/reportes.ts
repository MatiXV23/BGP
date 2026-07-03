import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  ReportesService,
  ResultadoEleccion,
  VotosPorDepartamento,
  VotosPorPartido,
} from '../../../shared/services/reportes.service';

@Component({
  selector: 'app-reportes',
  imports: [],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  private readonly reportesService = inject(ReportesService);
  private readonly cdr = inject(ChangeDetectorRef);

  resultadosEleccion: ResultadoEleccion[] = [];
  votosPorDepartamento: VotosPorDepartamento[] = [];
  votosPorPartido: VotosPorPartido[] = [];

  reporteActivo: 'eleccion' | 'departamento' | 'partido' = 'eleccion';

  cargando = false;
  errorCarga = '';

  ngOnInit(): void {
    void this.cargarReportes();
  }

  async cargarReportes(): Promise<void> {
    this.cargando = true;
    this.errorCarga = '';
    this.cdr.detectChanges();

    try {
      const [resultadosEleccion, votosPorDepartamento, votosPorPartido] = await Promise.all([
        this.reportesService.getResultadosEleccion(),
        this.reportesService.getVotosPorDepartamento(),
        this.reportesService.getVotosPorPartido(),
      ]);

      this.resultadosEleccion = resultadosEleccion;
      this.votosPorDepartamento = votosPorDepartamento;
      this.votosPorPartido = votosPorPartido;
    } catch (error) {
      console.error('Error al cargar reportes', error);
      this.errorCarga = 'No se pudieron cargar los reportes desde el backend.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  cambiarReporte(reporte: 'eleccion' | 'departamento' | 'partido'): void {
    this.reporteActivo = reporte;
  }

  totalEmitidos(): number {
    return this.resultadosEleccion.reduce((total, item) => total + item.votos_emitidos, 0);
  }

  totalValidos(): number {
    return this.resultadosEleccion.reduce((total, item) => total + item.votos_validos, 0);
  }

  totalAnulados(): number {
    return this.resultadosEleccion.reduce((total, item) => total + item.votos_anulados, 0);
  }

  totalObservados(): number {
    return this.resultadosEleccion.reduce((total, item) => total + item.votos_observados, 0);
  }
}

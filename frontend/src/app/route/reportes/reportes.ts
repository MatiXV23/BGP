import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  imports: [],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes {
  reporteGenerado = false;

  generarReporte(): void {
    this.reporteGenerado = true;
    console.log('Reporte generado');
  }

  limpiarReporte(): void {
    this.reporteGenerado = false;
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-configuracion',
  imports: [],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {
  modoMantenimiento = false;
  permitirResultados = false;

  alternarMantenimiento(): void {
    this.modoMantenimiento = !this.modoMantenimiento;
  }

  alternarResultados(): void {
    this.permitirResultados = !this.permitirResultados;
  }
}

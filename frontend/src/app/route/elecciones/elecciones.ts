import { Component } from '@angular/core';

@Component({
  selector: 'app-elecciones',
  imports: [],
  templateUrl: './elecciones.html',
  styleUrl: './elecciones.css',
})
export class Elecciones {
  mostrarFormulario = false;

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}

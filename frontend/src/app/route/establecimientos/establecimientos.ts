import { Component } from '@angular/core';

@Component({
  selector: 'app-establecimientos',
  imports: [],
  templateUrl: './establecimientos.html',
  styleUrl: './establecimientos.css',
})
export class Establecimientos {
  mostrarFormulario = false;

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}

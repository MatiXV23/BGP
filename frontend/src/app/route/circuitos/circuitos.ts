import { Component } from '@angular/core';

@Component({
  selector: 'app-circuitos',
  imports: [],
  templateUrl: './circuitos.html',
  styleUrl: './circuitos.css',
})
export class Circuitos {
  mostrarFormulario = false;

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}

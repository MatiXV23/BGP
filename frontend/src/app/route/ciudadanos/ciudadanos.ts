import { Component } from '@angular/core';

@Component({
  selector: 'app-ciudadanos',
  imports: [],
  templateUrl: './ciudadanos.html',
  styleUrl: './ciudadanos.css',
})

//hola
export class Ciudadanos {
  mostrarFormulario = false;

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-resultados',
  imports: [],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados {
  mesaCerrada = false;

  alternarVista(): void {
    this.mesaCerrada = !this.mesaCerrada;
  }
}

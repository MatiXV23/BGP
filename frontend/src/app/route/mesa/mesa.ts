import { Component } from '@angular/core';

@Component({
  selector: 'app-mesa',
  imports: [],
  templateUrl: './mesa.html',
  styleUrl: './mesa.css',
})
export class Mesa {
  mesaCerrada = false;

  cerrarMesa(): void {
    if (this.mesaCerrada) {
      return;
    }

    const confirmar = confirm('¿Confirmás el cierre de la mesa? Esta acción no se podrá deshacer.');

    if (!confirmar) {
      return;
    }

    this.mesaCerrada = true;
    console.log('Mesa cerrada');
  }
}

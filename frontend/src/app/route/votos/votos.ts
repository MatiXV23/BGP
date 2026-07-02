import { Component } from '@angular/core';

type Papeleta = {
  id: number;
  numeroLista: number | null;
  titulo: string;
  subtitulo: string;
  partido: string;
};

@Component({
  selector: 'app-votos',
  imports: [],
  templateUrl: './votos.html',
  styleUrl: './votos.css',
})
export class Vote {
  credencialCivica = '';
  circuitoIngresado = '0101';

  papeletas: Papeleta[] = [
    {
      id: 1,
      numeroLista: 8001,
      titulo: 'Lista 8001 — Frente Amplio',
      subtitulo: 'Junta Departamental · Montevideo',
      partido: 'Frente Amplio',
    },
    {
      id: 2,
      numeroLista: 8002,
      titulo: 'Lista 8002 — Partido Nacional',
      subtitulo: 'Junta Departamental · Montevideo',
      partido: 'Partido Nacional',
    },
    {
      id: 3,
      numeroLista: null,
      titulo: 'Candidato Intendente FA — Montevideo',
      subtitulo: 'Candidato a intendente',
      partido: 'Frente Amplio',
    },
    {
      id: 4,
      numeroLista: null,
      titulo: 'Candidato Intendente PN — Montevideo',
      subtitulo: 'Candidato a intendente',
      partido: 'Partido Nacional',
    },
  ];

  papeletasSeleccionadas = new Set<number>();

  alternarPapeleta(idPapeleta: number): void {
    if (this.papeletasSeleccionadas.has(idPapeleta)) {
      this.papeletasSeleccionadas.delete(idPapeleta);
    } else {
      this.papeletasSeleccionadas.add(idPapeleta);
    }
  }

  estaSeleccionada(idPapeleta: number): boolean {
    return this.papeletasSeleccionadas.has(idPapeleta);
  }

  limpiarSeleccion(): void {
    this.papeletasSeleccionadas.clear();
  }

  cantidadSeleccionadas(): number {
    return this.papeletasSeleccionadas.size;
  }

  emitirVoto(): void {
    console.log('Emitiendo voto con papeletas:', Array.from(this.papeletasSeleccionadas));
  }

  votarEnBlanco(): void {
    this.limpiarSeleccion();
    console.log('Emitiendo voto en blanco');
  }
}

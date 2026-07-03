import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export type ResultadoEleccion = {
  id_eleccion: number;
  fecha: string;
  tipo_eleccion: string;

  id_papeleta: number;
  numero_lista?: number;
  papeleta?: string;
  partido?: string;

  votos_emitidos: number;
  votos_validos: number;
  votos_anulados: number;
  votos_blancos: number;
  votos_observados: number;
};

export type VotosPorDepartamento = {
  id_eleccion: number;
  fecha: string;

  id_departamento: number;
  departamento: string;

  votos_emitidos: number;
  votos_validos: number;
  votos_anulados: number;
  votos_blancos: number;
  votos_observados: number;
};

export type VotosPorPartido = {
  id_eleccion: number;
  fecha: string;

  id_partido: number;
  partido: string;

  votos_emitidos: number;
  votos_validos: number;
  votos_anulados: number;
  votos_blancos: number;
  votos_observados: number;
};

export type VotosPorCandidato = {
  id_eleccion: number;
  fecha: string;
  tipo_eleccion: string;

  cedula_candidato: string;
  candidato: string;

  id_partido?: number;
  partido?: string;

  id_papeleta: number;
  numero_lista?: number;
  papeleta?: string;
  organo_candidatura?: string;

  tipo_vinculo: string;
  orden?: number;

  votos_emitidos: number;
  votos_validos: number;
  votos_anulados: number;
  votos_blancos: number;
  votos_observados: number;
};

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private readonly httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/reportes`;

  async getResultadosEleccion(): Promise<ResultadoEleccion[]> {
    return await firstValueFrom(
      this.httpClient.get<ResultadoEleccion[]>(`${this.base}/resultados-eleccion`),
    );
  }

  async getVotosPorDepartamento(): Promise<VotosPorDepartamento[]> {
    return await firstValueFrom(
      this.httpClient.get<VotosPorDepartamento[]>(`${this.base}/votos-por-departamento`),
    );
  }

  async getVotosPorPartido(): Promise<VotosPorPartido[]> {
    return await firstValueFrom(
      this.httpClient.get<VotosPorPartido[]>(`${this.base}/votos-por-partido`),
    );
  }

  async getVotosPorCandidato(): Promise<VotosPorCandidato[]> {
    return await firstValueFrom(
      this.httpClient.get<VotosPorCandidato[]>(`${this.base}/votos-por-candidato`),
    );
  }
}

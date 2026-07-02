import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { MesaActual, VerificacionVotante, VotoEmitido } from '../types/mesa-actual';

@Injectable({ providedIn: 'root' })
export class MesaService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/mesa`;

  public async getMia(): Promise<MesaActual> {
    return await firstValueFrom(this.httpClient.get<MesaActual>(`${this.base}/mia`));
  }

  // Mesa del circuito donde el usuario logeado está habilitado para votar (no requiere ser autoridad)
  public async getMiaVotacion(): Promise<MesaActual> {
    return await firstValueFrom(this.httpClient.get<MesaActual>(`${this.base}/mia/votacion`));
  }

  public async cerrar(id_mesa: number): Promise<void> {
    await firstValueFrom(this.httpClient.put(`${this.base}/${id_mesa}/cerrar`, {}));
  }

  // La credencial nunca se manda: siempre vota el usuario logeado, con su propia identidad.
  public async verificarVotante(numero_circuito_ingresado: string): Promise<VerificacionVotante> {
    return await firstValueFrom(
      this.httpClient.post<VerificacionVotante>(`${this.base}/mia/verificar-votante`, {
        numero_circuito_ingresado,
      }),
    );
  }

  public async emitirVoto(
    numero_circuito_ingresado: string,
    id_papeletas: number[],
  ): Promise<VotoEmitido> {
    return await firstValueFrom(
      this.httpClient.post<VotoEmitido>(`${this.base}/mia/votar`, {
        numero_circuito_ingresado,
        id_papeletas,
      }),
    );
  }
}

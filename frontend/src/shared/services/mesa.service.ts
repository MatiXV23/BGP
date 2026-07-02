import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { MesaActual } from '../types/mesa-actual';

@Injectable({ providedIn: 'root' })
export class MesaService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/mesa`;

  public async getMia(): Promise<MesaActual> {
    return await firstValueFrom(this.httpClient.get<MesaActual>(`${this.base}/mia`));
  }

  public async cerrar(id_mesa: number): Promise<void> {
    await firstValueFrom(this.httpClient.put(`${this.base}/${id_mesa}/cerrar`, {}));
  }
}

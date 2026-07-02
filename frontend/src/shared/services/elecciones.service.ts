import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Eleccion, EleccionPost } from '../types/electoral';
@Injectable({
  providedIn: 'root',
})
export class EleccionService {
  private httpClient = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/eleccion`;

  public async getAll(): Promise<Eleccion[]> {
    return await firstValueFrom(
      this.httpClient.get<Eleccion[]>(this.base)
    );
  }

  public async getById(id: number): Promise<Eleccion> {
    return await firstValueFrom(
      this.httpClient.get<Eleccion>(`${this.base}/${id}`)
    );
  }

  public async create(eleccion: EleccionPost): Promise<Eleccion> {
    return await firstValueFrom(
      this.httpClient.post<Eleccion>(this.base, eleccion)
    );
  }

  public async update(id: number, eleccion: Eleccion): Promise<void> {
    await firstValueFrom(
      this.httpClient.put<void>(`${this.base}/${id}`, eleccion)
    );
  }

  public async patch(id: number, eleccion: Partial<Eleccion>): Promise<void> {
    await firstValueFrom(
      this.httpClient.patch<void>(`${this.base}/${id}`, eleccion)
    );
  }

  public async delete(id: number): Promise<void> {
    await firstValueFrom(
      this.httpClient.delete<void>(`${this.base}/${id}`)
    );
  }
}
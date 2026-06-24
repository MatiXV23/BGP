import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario, UsuarioConPwd, UsuarioSinId } from '../types/usuario';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private httpClient = inject(HttpClient);

  public async getUserById(id_usuario: string): Promise<Usuario> {
    return await firstValueFrom(
      this.httpClient.get<Usuario>(`${environment.apiUrl}/usuarios/${id_usuario}`)
    );
  }

  public async postUsuario(datos: UsuarioConPwd): Promise<Usuario> {
    return await firstValueFrom(
      this.httpClient.post<Usuario>(environment.apiUrl + '/usuarios', datos)
    );
  }
  public async getUsuarios(queryParams?: { email?: string; nro_documento?: string }) {
    let params = new HttpParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.append(key, String(value));
        }
      });
    }

    return await firstValueFrom(
      this.httpClient.get<Usuario[]>(environment.apiUrl + '/usuarios', { params })
    );
  }

  public async eliminarUsuario(id: number) {
    await firstValueFrom(this.httpClient.delete(`${environment.apiUrl}/usuarios/${id}`));
  }

  public async updateUsuario(datos: Partial<Usuario>): Promise<void> {
    await firstValueFrom(
      this.httpClient.put(`${environment.apiUrl}/usuarios/${datos.id_usuario}`, datos)
    );
  }


  public async updateUserPwd(id_usuario: number, password: string): Promise<void> {
    await firstValueFrom(
      this.httpClient.put(`${environment.apiUrl}/usuarios/${id_usuario}/pwd`, {
        password: password,
      })
    );
  }


  

}

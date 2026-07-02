import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MainStore } from '../stores/main.store';
import { Credenciales } from '../types/credenciales';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../types/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private mainStore = inject(MainStore);
  private checkLocalStoragePromise: Promise<void> | null = null;

  async logIn(credenciales: Credenciales) {
    const { token } = await firstValueFrom(
      this.httpClient.post<{ token: string }>(environment.apiUrl + '/auth', credenciales),
    );

    localStorage.setItem('token', token);

    this.mainStore.token.set(token);
    this.mainStore.user.set(await this.getUser());
  }

  async logOut() {
    this.mainStore.token.set(undefined);
    this.mainStore.user.set(undefined);
    localStorage.removeItem('token');
  }

  // Coalesceado: si dos guards (o un guard y el App root) llaman a esto casi al mismo
  // tiempo, el segundo espera la MISMA promesa en vez de correr en paralelo. Sin esto,
  // el segundo llamador podía ver el token ya seteado por el primero y devolver antes
  // de que el usuario terminara de resolverse, dejando la guard con isLogged() en falso.
  async checkLocalStorage(): Promise<void> {
    if (this.checkLocalStoragePromise) return this.checkLocalStoragePromise;

    this.checkLocalStoragePromise = this.doCheckLocalStorage();
    try {
      await this.checkLocalStoragePromise;
    } finally {
      this.checkLocalStoragePromise = null;
    }
  }

  private async doCheckLocalStorage(): Promise<void> {
    if (!this.mainStore.token() && localStorage.getItem('token')) {
      this.mainStore.token.set(localStorage.getItem('token')!);
      if (!this.mainStore.user()) {
        try {
          this.mainStore.user.set(await this.getUser());
        } catch (e) {
          this.logOut();
        }
      }
    }
  }

  async getUser(): Promise<Usuario> {
    const user = await firstValueFrom(this.httpClient.get<Usuario>(environment.apiUrl + '/auth'));
    this.mainStore.user.set(user);
    return user;
  }
}

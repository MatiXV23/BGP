import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MainStore } from '../shared/stores/main.store';
import { AuthService } from '../shared/services/auth.service';
import { MesaContextService } from '../shared/services/mesa-context.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('front');

  protected readonly mainStore = inject(MainStore);
  protected readonly mesaContext = inject(MesaContextService);
  private authService = inject(AuthService);
  private router = inject(Router);

  protected readonly iniciales = computed(() => {
    const nombre = this.mainStore.user()?.nombre_completo;
    if (!nombre) return '—';
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join('');
  });

  protected readonly rolEnMesa = computed(() => {
    const user = this.mainStore.user();
    const mesa = this.mesaContext.mesa();
    if (!user || !mesa) return undefined;

    if (mesa.presidente.cedula_identidad === user.cedula_identidad) return 'Presidente/a de mesa';
    if (mesa.secretario.cedula_identidad === user.cedula_identidad) return 'Secretario/a de mesa';
    if (mesa.vocal.cedula_identidad === user.cedula_identidad) return 'Vocal de mesa';
    return undefined;
  });

  protected readonly mostrarPerfil = signal(false);

  togglePerfil(): void {
    this.mostrarPerfil.update((valor) => !valor);
  }

  constructor() {
    effect(() => {
      if (this.mainStore.token()) {
        this.mesaContext.refresh();
      } else {
        this.mesaContext.clear();
      }
    });
  }

  async cerrarMesa(): Promise<void> {
    const confirmar = confirm(
      '¿Confirmás el cierre de la mesa? Esta acción no se podrá deshacer.',
    );
    if (!confirmar) return;

    try {
      await this.mesaContext.cerrarMesa();
    } catch {
      alert('No se pudo cerrar la mesa.');
    }
  }

  async logOut(): Promise<void> {
    await this.authService.logOut();
    this.router.navigateByUrl('/login');
  }
}

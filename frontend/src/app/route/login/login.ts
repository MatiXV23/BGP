import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    cedula_identidad: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.authService.logIn(this.form.getRawValue());
      this.router.navigateByUrl('/');
    } catch {
      this.error.set('Cédula o contraseña incorrecta');
    } finally {
      this.loading.set(false);
    }
  }
}

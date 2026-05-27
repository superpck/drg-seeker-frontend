import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import CONFIG from '../../configs/config';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    username: ['User', [Validators.required, Validators.minLength(3)]],
    password: ['user', [Validators.required, Validators.minLength(3)]]
  });

  readonly config = CONFIG;

  onSubmit() {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials = this.form.getRawValue();
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.loginService.login(credentials).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigateByUrl('/drg-seeker');
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Login failed. Please try again.');
      }
    });
  }
}

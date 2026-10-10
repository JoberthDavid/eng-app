import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { AuthenticationStatus } from '../../../core/auth/auth.models';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  // ------------------------------------------------------------
  // Dependências da página
  // ------------------------------------------------------------

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // ------------------------------------------------------------
  // Estado da interface
  // ------------------------------------------------------------

  // Indica se uma requisição está em andamento.
  loading = false;

  // Mensagem de erro apresentada ao usuário.
  errorMessage = '';

  // ------------------------------------------------------------
  // Formulário de login
  // ------------------------------------------------------------

  loginForm = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]
  });

  // ------------------------------------------------------------
  // Envio do formulário
  // ------------------------------------------------------------

  submit(): void {

    // Limpa mensagens anteriores.
    this.errorMessage = '';

    // Se o formulário for inválido, não envia nada.
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const credentials = this.loginForm.getRawValue();

    // ----------------------------------------------------------
    // Chamada ao AuthService
    //
    // O AuthService é quem conhece o endpoint do Manifold.
    // A página não precisa conhecer a URL da API.
    // ----------------------------------------------------------

    this.authService.login(credentials).subscribe({

      next: (response) => {

        this.loading = false;

        // ------------------------------------------------------
        // Login normal
        // ------------------------------------------------------

        if (response.status === 'AUTHENTICATED') {

          // Busca os dados do usuário autenticado.
          //
          // O interceptor adicionará automaticamente:
          //
          // Authorization: Bearer <token>
          //
          // à requisição /me/.
          this.authService.me().subscribe({

            next: () => {
              this.router.navigate(['/projects']);
            },

            error: () => {
              this.errorMessage =
                'Login realizado, mas não foi possível carregar os dados do usuário.';
            }
          });

          return;
        }

        // ------------------------------------------------------
        // Login exige segundo fator
        // ------------------------------------------------------

        if (response.status === 'TWO_FACTOR_REQUIRED') {
          this.router.navigate(['/2fa']);
          return;
        }

        // ------------------------------------------------------
        // Outros estados retornados pela API
        // ------------------------------------------------------

        this.handleAuthenticationStatus(response.status);
      },

      error: (error) => {

        this.loading = false;

        // ------------------------------------------------------
        // Erros HTTP
        // ------------------------------------------------------

        if (error.status === 401) {
          this.errorMessage =
            'E-mail ou senha inválidos.';
          return;
        }

        if (error.status === 403) {
          this.errorMessage =
            'Usuário inativo ou sem permissão para acessar o sistema.';
          return;
        }

        if (error.status === 0) {
          this.errorMessage =
            'Não foi possível conectar ao servidor.';
          return;
        }

        this.errorMessage =
          'Não foi possível realizar o login. Tente novamente.';
      }
    });
  }

  // ------------------------------------------------------------
  // Tratamento dos estados retornados pelo Manifold
  // ------------------------------------------------------------

  private handleAuthenticationStatus(
    status: AuthenticationStatus
  ): void {

    switch (status) {

      case 'INVALID_CREDENTIALS':
        this.errorMessage =
          'E-mail ou senha inválidos.';
        break;

      case 'INACTIVE_USER':
        this.errorMessage =
          'Este usuário está inativo.';
        break;

      case 'EMAIL_DELIVERY_FAILED':
        this.errorMessage =
          'Não foi possível enviar o código de autenticação.';
        break;

      default:
        this.errorMessage =
          'Não foi possível concluir a autenticação.';
        break;
    }
  }
}
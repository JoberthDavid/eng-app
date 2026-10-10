import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-two-factor-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './two-factor-page.component.html',
  styleUrl: './two-factor-page.component.scss'
})
export class TwoFactorPageComponent {

  // ------------------------------------------------------------
  // Dependências
  // ------------------------------------------------------------

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // ------------------------------------------------------------
  // Estado da interface
  // ------------------------------------------------------------

  loading = false;

  errorMessage = '';

  // Quantidade de tentativas restantes.
  attemptsRemaining: number | null = null;

  // ------------------------------------------------------------
  // Formulário
  // ------------------------------------------------------------

  twoFactorForm = this.fb.nonNullable.group({
    code: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]
    ]
  });

  // ------------------------------------------------------------
  // Inicialização
  // ------------------------------------------------------------

  constructor() {

    // ----------------------------------------------------------
    // Recuperamos o desafio de 2FA armazenado pelo AuthService.
    // ----------------------------------------------------------

    const pending = this.authService.getPendingTwoFactor();

    if (!pending) {

      // Não existe desafio pendente.
      //
      // Portanto, não faz sentido permanecer na tela de 2FA.
      this.router.navigate(['/login']);

      return;
    }

    this.attemptsRemaining = pending.attempts_remaining;
  }

  // ------------------------------------------------------------
  // Envio do código
  // ------------------------------------------------------------

  submit(): void {

    this.errorMessage = '';

    if (this.twoFactorForm.invalid) {

      this.twoFactorForm.markAllAsTouched();

      return;
    }

    const pending = this.authService.getPendingTwoFactor();

    // ----------------------------------------------------------
    // Segurança adicional:
    //
    // não enviamos o código se o desafio não estiver mais
    // disponível no AuthService.
    // ----------------------------------------------------------

    if (!pending) {

      this.errorMessage =
        'A autenticação de dois fatores expirou. Faça o login novamente.';

      return;
    }

    this.loading = true;

    const request = {
      challenge_id: pending.challenge_id,
      code: this.twoFactorForm.controls.code.value
    };

    // ----------------------------------------------------------
    // Envia o código para o Manifold.
    // ----------------------------------------------------------

    this.authService.verifyTwoFactor(request).subscribe({

      next: (response) => {

        this.loading = false;

        // ------------------------------------------------------
        // Código correto
        // ------------------------------------------------------

        if (response.status === 'AUTHENTICATED') {

          this.authService.me().subscribe({

            next: () => {
              this.router.navigate(['/projects']);
            },

            error: () => {
              this.errorMessage =
                'Autenticação concluída, mas não foi possível carregar os dados do usuário.';
            }
          });

          return;
        }

        // ------------------------------------------------------
        // Código incorreto
        // ------------------------------------------------------

        if (response.status === 'TWO_FACTOR_INVALID_CODE') {

          this.attemptsRemaining =
            response.attempts_remaining;

          this.errorMessage =
            this.buildInvalidCodeMessage();

          return;
        }

        // ------------------------------------------------------
        // Código expirado
        // ------------------------------------------------------

        if (response.status === 'TWO_FACTOR_EXPIRED') {

          this.errorMessage =
            'O código expirou. Faça o login novamente.';

          return;
        }

        // ------------------------------------------------------
        // Tentativas esgotadas
        // ------------------------------------------------------

        if (response.status === 'TWO_FACTOR_EXHAUSTED') {

          this.errorMessage =
            'O número máximo de tentativas foi atingido. Faça o login novamente.';

          return;
        }

        // ------------------------------------------------------
        // Desafio revogado
        // ------------------------------------------------------

        if (response.status === 'TWO_FACTOR_REVOKED') {

          this.errorMessage =
            'Este desafio de autenticação foi revogado. Faça o login novamente.';

          return;
        }

        this.errorMessage =
          'Não foi possível validar o código.';
      },

      error: (error) => {

        this.loading = false;

        if (error.status === 400) {

          this.errorMessage =
            'Código inválido ou desafio de autenticação expirado.';

          return;
        }

        if (error.status === 0) {

          this.errorMessage =
            'Não foi possível conectar ao servidor.';

          return;
        }

        this.errorMessage =
          'Não foi possível validar o código. Tente novamente.';
      }
    });
  }

  // ------------------------------------------------------------
  // Mensagem para código inválido
  // ------------------------------------------------------------

  private buildInvalidCodeMessage(): string {

    if (this.attemptsRemaining === null) {
      return 'Código inválido.';
    }

    if (this.attemptsRemaining === 0) {
      return 'Código inválido. Não há mais tentativas disponíveis.';
    }

    if (this.attemptsRemaining === 1) {
      return 'Código inválido. Resta 1 tentativa.';
    }

    return `Código inválido. Restam ${this.attemptsRemaining} tentativas.`;
  }

  // ------------------------------------------------------------
  // Voltar para o login
  // ------------------------------------------------------------

  backToLogin(): void {

    this.authService.clearSession();

    this.router.navigate(['/login']);
  }
}
import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  tap
} from 'rxjs';

import {
  AuthenticatedUser,
  AuthenticationResponse,
  LoginRequest,
  TwoFactorVerifyRequest,
  PendingTwoFactor
} from './auth.models';


/*
 * ============================================================
 * CONFIGURAÇÃO DO MANIFOLD
 * ============================================================
 *
 * TEMPORARIAMENTE deixamos a URL centralizada aqui.
 *
 * IMPORTANTE:
 *
 * Esta é a URL do MANIFOLD.
 *
 * Não colocaremos aqui URLs de:
 *
 * - SICRO
 * - VGEO
 * - composition-engine
 * - scraper
 * - budget-engine
 *
 * O ENG-APP conhece somente o Manifold.
 *
 * Posteriormente podemos mover esta configuração para
 * environment.ts / environment.prod.ts.
 * ============================================================
 */

const MANIFOLD_API_URL = 'http://127.0.0.1:8000';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /*
   * HttpClient é o mecanismo usado para conversar
   * com o manifold-api.
   */
  private readonly http = inject(HttpClient);


  /*
   * ==========================================================
   * ESTADO DO USUÁRIO
   * ==========================================================
   *
   * BehaviorSubject permite que qualquer parte da aplicação
   * saiba imediatamente quem está autenticado.
   *
   * Inicialmente não sabemos quem é o usuário.
   */
  private readonly currentUserSubject =
    new BehaviorSubject<AuthenticatedUser | null>(null);


  /**
   * Observable público do usuário autenticado.
   *
   * Componentes podem observar:
   *
   * authService.currentUser$
   */
  readonly currentUser$ =
    this.currentUserSubject.asObservable();


  /*
   * ==========================================================
   * DESAFIO 2FA
   * ==========================================================
   *
   * Quando o Manifold responder:
   *
   * TWO_FACTOR_REQUIRED
   *
   * guardaremos temporariamente o challenge_id.
   *
   * Esse valor não é uma sessão.
   *
   * Ele serve apenas para concluir a autenticação.
   */
  private readonly pendingTwoFactorSubject =
    new BehaviorSubject<PendingTwoFactor | null>(null);


  readonly pendingTwoFactor$ =
    this.pendingTwoFactorSubject.asObservable();


  /*
   * ==========================================================
   * STORAGE
   * ==========================================================
   *
   * Nesta primeira etapa vamos usar sessionStorage.
   *
   * Isso significa que o token fica associado à sessão
   * daquela aba/janela do navegador e não é persistido
   * como uma preferência permanente.
   *
   * O token é tratado como credencial opaca.
   *
   * Não tentamos decodificá-lo.
   */
  private readonly TOKEN_KEY = 'eng_app_session_token';


  /**
   * Realiza login no Manifold.
   *
   * Endpoint:
   *
   * POST /api/auth/login/
   */
  login(
    credentials: LoginRequest
  ): Observable<AuthenticationResponse> {

    return this.http
      .post<AuthenticationResponse>(
        `${MANIFOLD_API_URL}/api/auth/login/`,
        credentials
      )
      .pipe(

        tap(response => {

          /*
           * Caso o backend diga que precisamos de 2FA,
           * guardamos o challenge_id.
           */
          if (
            response.status === 'TWO_FACTOR_REQUIRED' &&
            response.challenge_id
          ) {

            this.pendingTwoFactorSubject.next({
              challenge_id: response.challenge_id,
              attempts_remaining:
                response.attempts_remaining
            });

            return;
          }


          /*
           * Caso a autenticação tenha terminado diretamente,
           * recebemos o session token.
           */
          if (
            response.status === 'AUTHENTICATED' &&
            response.token
          ) {

            this.storeToken(response.token);

            /*
             * O desafio 2FA deixa de existir.
             */
            this.pendingTwoFactorSubject.next(null);
          }

        })
      );
  }


  /**
   * Valida o código 2FA.
   *
   * Endpoint:
   *
   * POST /api/auth/2fa/verify/
   */
  verifyTwoFactor(
    request: TwoFactorVerifyRequest
  ): Observable<AuthenticationResponse> {

    return this.http
      .post<AuthenticationResponse>(
        `${MANIFOLD_API_URL}/api/auth/2fa/verify/`,
        request
      )
      .pipe(

        tap(response => {

          /*
           * Se o código ainda estiver errado, mas o desafio
           * continuar ativo, atualizamos as tentativas restantes.
           */
          if (
            response.status === 'TWO_FACTOR_INVALID_CODE'
          ) {

            const currentChallenge =
              this.pendingTwoFactorSubject.value;

            if (currentChallenge) {

              this.pendingTwoFactorSubject.next({
                challenge_id:
                  currentChallenge.challenge_id,

                attempts_remaining:
                  response.attempts_remaining
              });
            }

            return;
          }


          /*
           * Quando o Manifold autenticar o usuário,
           * recebemos o session token.
           */
          if (
            response.status === 'AUTHENTICATED' &&
            response.token
          ) {

            this.storeToken(response.token);

            /*
             * O challenge já foi consumido.
             */
            this.pendingTwoFactorSubject.next(null);
          }

        })
      );
  }


  /**
   * Consulta o usuário atualmente autenticado.
   *
   * Endpoint:
   *
   * GET /api/auth/me/
   *
   * IMPORTANTE:
   *
   * Não precisamos colocar o Authorization aqui.
   *
   * O auth.interceptor fará isso automaticamente.
   */
  me(): Observable<AuthenticatedUser> {

    return this.http
      .get<AuthenticatedUser>(
        `${MANIFOLD_API_URL}/api/auth/me/`
      )
      .pipe(

        tap(user => {

          /*
           * O Manifold confirmou quem somos.
           */
          this.currentUserSubject.next(user);

        })
      );
  }


  /**
   * Faz logout da sessão atual.
   *
   * Endpoint:
   *
   * POST /api/auth/logout/
   */
  logout(): Observable<unknown> {

    return this.http
      .post(
        `${MANIFOLD_API_URL}/api/auth/logout/`,
        {}
      )
      .pipe(

        tap(() => {

          /*
           * Só limpamos o frontend depois que o Manifold
           * confirmar o logout.
           */
          this.clearSession();

        })
      );
  }


  /**
   * Retorna o token atualmente armazenado.
   *
   * O token é tratado como string opaca.
   */
  getToken(): string | null {

    return sessionStorage.getItem(
      this.TOKEN_KEY
    );
  }


  /**
   * Indica se o frontend possui uma sessão.
   *
   * ATENÇÃO:
   *
   * Isto não significa que a sessão ainda seja válida.
   *
   * Quem confirma a validade é o Manifold.
   *
   * Por isso /me continua sendo importante.
   */
  isAuthenticated(): boolean {

    return !!this.getToken();
  }

    /**
   * Retorna o desafio 2FA atualmente pendente.
   *
   * O componente não acessa diretamente o BehaviorSubject.
   */
  getPendingTwoFactor(): PendingTwoFactor | null {

    return this.pendingTwoFactorSubject.value;
  }

  /**
   * Remove toda informação de sessão do frontend.
   */
  clearSession(): void {

    sessionStorage.removeItem(
      this.TOKEN_KEY
    );

    this.currentUserSubject.next(null);

    this.pendingTwoFactorSubject.next(null);
  }


  /**
   * Guarda o session token retornado pelo Manifold.
   */
  private storeToken(token: string): void {

    sessionStorage.setItem(
      this.TOKEN_KEY,
      token
    );
  }

}
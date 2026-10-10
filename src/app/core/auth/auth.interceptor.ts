import {
  HttpInterceptorFn
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  AuthService
} from './auth.service';


/*
 * ============================================================
 * INTERCEPTOR DE AUTENTICAÇÃO
 * ============================================================
 *
 * Responsabilidade:
 *
 * 1. pegar o session token;
 * 2. colocar:
 *
 *      Authorization: Bearer <token>
 *
 *    automaticamente;
 *
 * 3. detectar 401;
 * 4. limpar a sessão;
 * 5. mandar o usuário para /login.
 *
 * Dessa maneira NENHUM serviço da aplicação precisa escrever
 * manualmente o header Authorization.
 * ============================================================
 */

export const authInterceptor: HttpInterceptorFn =
  (request, next) => {

    const authService =
      inject(AuthService);

    const router =
      inject(Router);


    /*
     * Recuperamos o token da sessão atual.
     */
    const token =
      authService.getToken();


    /*
     * Se não existe token, simplesmente continuamos
     * com a requisição original.
     *
     * Isso é necessário porque /login e /2fa são endpoints
     * públicos.
     */
    if (!token) {

      return next(request).pipe(

        catchError(error => {

          /*
           * Se mesmo sem token recebermos 401,
           * simplesmente propagamos o erro.
           */
          return throwError(() => error);

        })
      );
    }


    /*
     * HttpRequest é imutável.
     *
     * Portanto usamos clone() para adicionar o header.
     */
    const authenticatedRequest =
      request.clone({

        setHeaders: {
          Authorization: `Bearer ${token}`
        }

      });


    /*
     * Enviamos a requisição autenticada.
     */
    return next(
      authenticatedRequest
    ).pipe(

      catchError(error => {

        /*
         * HTTP 401 significa que o Manifold não aceitou
         * nossa sessão.
         *
         * Pode ser:
         *
         * - token inválido;
         * - sessão expirada;
         * - sessão revogada;
         * - usuário inativo.
         */
        if (error.status === 401) {

          /*
           * Apagamos o token local.
           */
          authService.clearSession();


          /*
           * Voltamos para o login.
           */
          void router.navigate([
            '/login'
          ]);
        }


        /*
         * O erro continua sendo propagado para que o
         * componente/serviço também possa tratá-lo se desejar.
         */
        return throwError(() => error);

      })
    );
  };
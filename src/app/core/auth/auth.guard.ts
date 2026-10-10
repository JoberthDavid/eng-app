import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from './auth.service';


/*
 * ============================================================
 * GUARD DE AUTENTICAÇÃO
 * ============================================================
 *
 * Impede que páginas internas sejam acessadas sem uma
 * sessão local.
 *
 * Fluxo:
 *
 * /projects
 *     ↓
 * AuthGuard
 *     ↓
 * existe token?
 *
 * SIM → continua
 *
 * NÃO → /login
 *
 * IMPORTANTE:
 *
 * O guard não substitui o Manifold.
 *
 * Ele apenas evita navegação obviamente inválida.
 *
 * A validade real da sessão é determinada pelo Manifold.
 * ============================================================
 */

export const authGuard: CanActivateFn = () => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);


  /*
   * Se existe token local, permitimos a navegação.
   *
   * Caso o token esteja expirado, o primeiro request
   * autenticado receberá 401 e o interceptor cuidará
   * do redirecionamento.
   */
  if (authService.isAuthenticated()) {

    return true;
  }


  /*
   * Não existe sessão.
   *
   * Mandamos para login.
   */
  return router.createUrlTree([
    '/login'
  ]);
};
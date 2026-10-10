/*
 * ============================================================
 * MODELOS DE AUTENTICAÇÃO
 * ============================================================
 *
 * Estes tipos representam EXATAMENTE o contrato que o
 * manifold-api fornece para autenticação.
 *
 * O ENG-APP não conhece:
 *
 * - banco de dados do Manifold;
 * - Session;
 * - AuthenticationChallenge;
 * - credenciais dos serviços;
 * - SICRO;
 * - VGEO;
 * - composition-engine;
 * - scraper;
 * - budget-engine.
 *
 * Ele conhece somente o contrato HTTP público do Manifold.
 * ============================================================
 */


/**
 * Estados possíveis retornados pelo fluxo de autenticação
 * do manifold-api.
 */
export type AuthenticationStatus =
  | 'AUTHENTICATED'
  | 'TWO_FACTOR_REQUIRED'
  | 'INVALID_CREDENTIALS'
  | 'INACTIVE_USER'
  | 'TWO_FACTOR_INVALID_CODE'
  | 'TWO_FACTOR_EXPIRED'
  | 'TWO_FACTOR_EXHAUSTED'
  | 'TWO_FACTOR_REVOKED'
  | 'EMAIL_DELIVERY_FAILED';


/**
 * Dados enviados para:
 *
 * POST /api/auth/login/
 */
export interface LoginRequest {

  email: string;

  password: string;
}


/**
 * Dados enviados para:
 *
 * POST /api/auth/2fa/verify/
 */
export interface TwoFactorVerifyRequest {

  challenge_id: string;

  code: string;
}


/**
 * Resposta comum das operações de autenticação
 * do manifold-api.
 *
 * O backend utiliza o mesmo formato tanto para login
 * quanto para validação do 2FA.
 */
export interface AuthenticationResponse {

  /**
   * Estado da operação de autenticação.
   */
  status: AuthenticationStatus;

  /**
   * Identificador do desafio 2FA.
   *
   * Será preenchido quando:
   *
   * status === 'TWO_FACTOR_REQUIRED'
   *
   * Em uma autenticação normal será null.
   */
  challenge_id: string | null;

  /**
   * Quantidade de tentativas restantes.
   *
   * É relevante principalmente quando existe 2FA.
   */
  attempts_remaining: number | null;

  /**
   * Token da sessão.
   *
   * Quando o usuário estiver autenticado:
   *
   * status === 'AUTHENTICATED'
   *
   * token terá o valor retornado pelo Manifold.
   */
  token: string | null;
}


/**
 * Resposta de:
 *
 * GET /api/auth/me/
 *
 * Representa o usuário que o Manifold identificou
 * através do session token.
 */
export interface AuthenticatedUser {

  id: string;

  email: string;

  is_active: boolean;
}


/**
 * Estado interno que podemos manter durante
 * a autenticação.
 *
 * Não é uma resposta do backend.
 */
export interface PendingTwoFactor {

  challenge_id: string;

  attempts_remaining: number | null;
}
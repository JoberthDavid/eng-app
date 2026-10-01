/*
 * Modelos relacionados ao orçamento de materiais.
 *
 * Premissas:
 *
 * - Valores monetários permanecem como string.
 * - Angular não realiza cálculos.
 * - Backend futuro utilizará Decimal.
 *
 * Estrutura:
 *
 * 1) MaterialSupplierQuotation
 *    -> Tabela 1
 *    -> Cotação e atualização do preço de aquisição
 *
 * 2) MaterialTransportQuotation
 *    -> Tabela 2
 *    -> Transporte associado ao fornecedor
 *
 * 3) AdoptedMaterialCost
 *    -> Tabela 3
 *    -> Consolidação aquisição + transporte
 */



// ============================================================
// TABELA 1
// COTAÇÃO DE AQUISIÇÃO DO MATERIAL
// ============================================================


export interface MaterialSupplierQuotation {


  /*
   * Identificação fornecedor
   */

  supplier: string;


  originState: string;


  originCity: string;



  /*
   * Dados da cotação original
   */

  unitPrice: string;


  unit: string;


  sicroUnit: string;



  /*
   * Atualização monetária
   */

  quotationMonth: string;


  adjustmentIndex: string;



  /*
   * Conversão para unidade SICRO
   */

  unitConverter: string;


  sicroUnitPrice: string;



  /*
   * Índices econômicos
   */

  quotationMonthIndex: string;


  baseDateIndex: string;



  /*
   * Fator de atualização
   */

  adjustment: string;



  /*
   * Valor corrigido para data-base
   */

  adjustedSicroUnitPrice: string;

}





// ============================================================
// TABELA 2
// TRANSPORTE ASSOCIADO AO FORNECEDOR
// ============================================================


export interface MaterialTransportQuotation {


  /*
   * Relacionamento
   *
   * O transporte pertence ao fornecedor
   * da cotação de aquisição.
   */

  supplier: string;


  originCity: string;


  destination: string;



  /*
   * Distâncias utilizadas no transporte SICRO
   */

  pavedDistanceKm: string;


  primaryDistanceKm: string;


  naturalDistanceKm: string;



  /*
   * Composições de transporte
   */

  transportLnCode: string;


  transportRpCode: string;


  transportPvCode: string;



  /*
   * Custos separados
   */

  costLn: string;


  costRp: string;


  costPv: string;



  /*
   * Custo total transporte
   */

  totalTransport: string;

}





// ============================================================
// TABELA 3
// CONSOLIDAÇÃO DO CUSTO FINAL
// ============================================================


export interface AdoptedMaterialCost {


  /*
   * Fornecedor analisado
   */

  supplier: string;



  /*
   * Valores provenientes das tabelas anteriores
   */

  acquisitionCost: string;


  transportCost: string;



  /*
   * Custo final entregue
   */

  totalCost: string;



  /*
   * Indicador visual.
   *
   * O cálculo da escolha será feito na API.
   */

  adopted: boolean;

}





// ============================================================
// MATERIAL
// Entidade principal da tela
// ============================================================


export interface MaterialQuotation {


  code: string;


  material: string;



  /*
   * Tabela 1
   */

  quotations: MaterialSupplierQuotation[];



  /*
   * Tabela 2
   */

  transports: MaterialTransportQuotation[];



  /*
   * Tabela 3
   */

  adoptedCosts: AdoptedMaterialCost[];

}
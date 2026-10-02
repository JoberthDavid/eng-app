export type QuantityPlanningMode =
  | 'BUDGET'
  | 'ANNUAL_WORK_PLAN_BUDGET';

export type AnnualWorkPlanMode =
  | 'INDEPENDENT'
  | 'REPEAT';

export type AnnualWorkPlanBudgetQuantityMode =
  | 'INVENTORY_X_EFFORT'
  | 'DIRECT';

export type AnnualWorkPlanBudgetStatus =
  | 'DRAFT'
  | 'CALCULATED'
  | 'APPROVED';


/**
 * PATO / Plano Anual de Trabalho e Orçamento.
 *
 * Represents the annual planning context associated
 * with a budget.
 */
export interface AnnualWorkPlanBudget {

  id: string;

  budgetId: string;

  quantityPlanningMode: QuantityPlanningMode;

  status: AnnualWorkPlanBudgetStatus;

  structure: AnnualWorkPlanBudgetStructure;

  plans: AnnualWorkPlanBudgetPlan[];
}


/**
 * Canonical contractual structure.
 *
 * Shared by Budget, PATO and other views.
 */
export interface AnnualWorkPlanBudgetStructure {

  groups: AnnualWorkPlanBudgetGroup[];
}


/**
 * Organizational grouping.
 *
 * Group does not contain quantity, unit or price.
 */
export interface AnnualWorkPlanBudgetGroup {

  id: string;

  code: string;

  description: string;

  sortOrder: string;

  services: AnnualWorkPlanBudgetServiceItem[];
}


/**
 * Contractual service.
 *
 * Represents the execution, measurement and
 * payment unit of the contract.
 */
export interface AnnualWorkPlanBudgetServiceItem {

  id: string;

  groupId: string;

  code: string;

  description: string;

  sortOrder: string;

  compositions: AnnualWorkPlanBudgetComposition[];
}


/**
 * Composition associated with a Service.
 *
 * Factor belongs to the Service-Composition
 * relationship.
 */
export interface AnnualWorkPlanBudgetComposition {

  id: string;

  serviceId: string;

  catalogItemId?: string;

  compositionCode: string;

  description: string;

  unit: string;

  factor: string;

  sortOrder: string;
}


/**
 * Annual planning instance.
 *
 * A contract may contain one or more annual plans.
 */
export interface AnnualWorkPlanBudgetPlan {

  id: string;

  year: string;

  startDate: string;

  endDate: string;

  mode: AnnualWorkPlanMode;

  /**
   * Used when mode === 'REPEAT'.
   */
  sourcePlanId: string | null;

  servicePlans: AnnualWorkPlanBudgetServicePlan[];
}


/**
 * Annual planning data for a specific Service.
 */
export interface AnnualWorkPlanBudgetServicePlan {

  id: string;

  serviceId: string;

  measurement: AnnualWorkPlanBudgetMeasurement;

  compositions: AnnualWorkPlanBudgetCompositionPlan[];
}


/**
 * Annual planning / budget information associated
 * with a composition for a specific ServicePlan.
 *
 * This is not part of the canonical composition
 * structure.
 */
export interface AnnualWorkPlanBudgetCompositionPlan {

  compositionId: string;

  quantity: string;

  unitPrice: string;

  totalCost: string;
}


/**
 * Measurement / quantity planning data.
 */
export interface AnnualWorkPlanBudgetMeasurement {

  quantityMode: AnnualWorkPlanBudgetQuantityMode;

  inventoryQuantity: string;

  inventoryUnit: string;

  effortLevel: string;

  effortUnit: string;

  workQuantity: string;

  workUnit: string;

  justification: string;
}
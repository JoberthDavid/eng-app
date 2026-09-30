export interface MaterialSupplierQuotation {
  supplier: string;

  unitPrice: number;

  unit: string;

  sicroUnit: string;

  quotationMonth: string;

  adjustmentIndex: string;

  unitConverter: number;

  sicroUnitPrice: number;

  quotationMonthIndex: number;

  baseDateIndex: number;

  adjustment: number;

  adjustedSicroUnitPrice: number;

  transportLnCode: string;

  transportRpCode: string;

  transportPvCode: string;

  costLn: number;

  costRp: number;

  costPv: number;

  totalCost: number;

  adopted: boolean;

  transportType: string;
}

export interface MaterialQuotation {
  code: string;
  material: string;
  quotations: MaterialSupplierQuotation[];
  adoptedQuotation?: string;
}
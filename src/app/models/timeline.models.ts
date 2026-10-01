export type TimelineView = 'PERCENTUAL' | 'FINANCEIRO';

export type TimelineRowType = 'GROUP' | 'ITEM';

export interface TimelineMonth {
  number: string;
  label: string;
  year: string;
}

export interface TimelineRow {
  code: string;
  description: string;
  unit: string;
  quantity: string;
  totalCost: string;
  type: TimelineRowType;
  parentCode: string | null;
  monthlyPercentages: string[];
  monthlyValues: string[];
}

export interface TimelineSummary {
  totalCost: string;
  contractTermMonths: string;
  startDate: string;
  monthlyAverage: string;
}

export interface TimelineResult {
  budgetId: string;
  referenceDate: string;
  contractTermMonths: string;
  startDate: string;
  months: TimelineMonth[];
  rows: TimelineRow[];
  summary: TimelineSummary;
}

export interface TimelineReportRequest {
  budgetId: string;
  format: 'PDF';
}
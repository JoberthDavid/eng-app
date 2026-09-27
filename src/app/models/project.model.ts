export interface ProjectBudget {
  referenceDate: string;
  status: string;
  total: string;
}

export interface ProjectSummary {
  code: string;
  description: string;
  uf: string;
  highway: string;
  budgets: number;
}

export interface ProjectDetail {
  code: string;
  description: string;
  uf: string;
  highway: string;
  budgets: ProjectBudget[];
}
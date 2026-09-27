import { Budget } from './budget.model';

export interface Project {
  code: string;
  description: string;
  uf: string;
  highway: string;
  budgets: Budget[];
}
import { Budget } from './budget.model';

export interface Project {
  id: string;
  code: string;
  description: string;
  uf: string;
  monetaryBaseDate: string;
  budgets: Budget[];
}
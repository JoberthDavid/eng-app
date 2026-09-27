import { TestBed } from '@angular/core/testing';

import { BudgetService } from './budget.service';

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BudgetService
      ]
    });

    service = TestBed.inject(BudgetService);
  });

  it('deve localizar um orçamento pelo projeto e pelo id do orçamento', () => {
    const budget = service.getBudget('PRJ-001', 'BUD-001');

    expect(budget).not.toBeNull();
    expect(budget?.id).toBe('BUD-001');
  });

  it('deve retornar null quando o orçamento não existir no projeto', () => {
    const budget = service.getBudget('PRJ-001', 'BUD-999');

    expect(budget).toBeNull();
  });

  it('deve retornar null quando o projeto não existir', () => {
    const budget = service.getBudget('PRJ-999', 'BUD-001');

    expect(budget).toBeNull();
  });

  it('deve devolver os dados corretos do orçamento', () => {
    const budget = service.getBudget('PRJ-001', 'BUD-002');

    expect(budget).not.toBeNull();

    expect(budget?.id).toBe('BUD-002');
    expect(budget?.methodology).toBe('SC');
    expect(budget?.typeSystem).toBe('ON');
    expect(budget?.totalCost).toBe('R$ 1.248.530,42');
  });
});
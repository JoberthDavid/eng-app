import { Injectable } from '@angular/core';

import {
  ProjectDetail,
  ProjectSummary
} from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly projects: ProjectDetail[] = [
    {
      code: 'PRJ-001',
      description: 'Conservação rodoviária',
      uf: 'GO',
      highway: 'BR-060',
      budgets: [
        {
          referenceDate: '01/07/2026',
          status: 'Rascunho',
          total: '—'
        },
        {
          referenceDate: '01/06/2026',
          status: 'Calculado',
          total: 'R$ 1.248.530,42'
        },
        {
          referenceDate: '01/05/2026',
          status: 'Finalizado',
          total: 'R$ 1.196.420,15'
        }
      ]
    },
    {
      code: 'PRJ-002',
      description: 'Manutenção de pavimento',
      uf: 'DF',
      highway: 'BR-040',
      budgets: [
        {
          referenceDate: '01/07/2026',
          status: 'Calculado',
          total: 'R$ 845.200,00'
        },
        {
          referenceDate: '01/06/2026',
          status: 'Finalizado',
          total: 'R$ 811.450,00'
        }
      ]
    },
    {
      code: 'PRJ-003',
      description: 'Conservação rotineira',
      uf: 'GO',
      highway: 'BR-153',
      budgets: [
        {
          referenceDate: '01/05/2026',
          status: 'Finalizado',
          total: 'R$ 876.240,18'
        }
      ]
    }
  ];

  getProjects(): ProjectSummary[] {
    return this.projects.map(project => ({
      code: project.code,
      description: project.description,
      uf: project.uf,
      highway: project.highway,
      budgets: project.budgets.length
    }));
  }

  getProject(id: string): ProjectDetail | null {
    return this.projects.find(project => project.code === id) ?? null;
  }
}

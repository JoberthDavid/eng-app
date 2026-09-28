import { Injectable } from '@angular/core';

import { Project } from '../models/project.model';
import { Budget } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly projects: Project[] = [
    {
      code: 'PRJ-001',
      description: 'Conservação rodoviária',
      uf: 'GO',
      highway: 'BR-060',
      budgets: [
      {
        id: 'BUD-001',
        projectId: '',
        referenceDate: '01/07/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Rascunho',
        totalCost: '—',
        services: []
      },
      {
        id: 'BUD-002',
        projectId: '',
        referenceDate: '01/06/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Calculado',
        totalCost: 'R$ 1.248.530,42',
        services: [
          {
            code: 'SERV-001',
            description: 'Execução de serviço de conservação rodoviária',
            unit: 'm²',
            quantity: 1250,
            compositions: [
              {
                code: 'COMP-001',
                referenceDate: '01/06/2026',
                factor: 1,
                unitCost: 'R$ 125,40',
                totalCost: 'R$ 125,40',
                auxiliaryCompositions: [
                  {
                    code: 'COMP-AUX-001',
                    description: 'Atividade auxiliar de demonstração',
                    unit: 'un',
                    quantity: 1
                  }
                ],
                fixedTimeCompositions: [
                  {
                    code: 'COMP-TF-001',
                    description: 'Tempo fixo de demonstração',
                    unit: 'h',
                    quantity: 0.5
                  }
                ],
                inputs: [
                  {
                    id: 1,
                    inputGroup: 'MA',
                    genericItem: 'INS-001',
                    genericDescription: '...',
                    unit: '...',
                    inputQuantity: 10,
                    inputUse: 0.1,
                    proprietaryItem: null
                  }
                ]
              },
              {
                code: 'COMP-002',
                referenceDate: '01/05/2026',
                factor: 0.35,
                unitCost: 'R$ 200,00',
                totalCost: 'R$ 70,00',
                auxiliaryCompositions: [],
                fixedTimeCompositions: [],
                inputs: [
                  {
                    id: 2,
                    inputGroup: 'MO',
                    genericItem: 'INS-001',
                    genericDescription: '...',
                    unit: '...',
                    inputQuantity: 50,
                    inputUse: 0.2,
                    proprietaryItem: null
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'BUD-003',
        projectId: '',
        referenceDate: '01/05/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Finalizado',
        totalCost: 'R$ 1.196.420,15',
        services: []
      },
      ]
    },
    {
      code: 'PRJ-002',
      description: 'Manutenção de pavimento',
      uf: 'DF',
      highway: 'BR-040',
      budgets: [
      {
        id: 'BUD-004',
        projectId: '',
        referenceDate: '01/07/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Calculado',
        totalCost: 'R$ 845.200,00',
        services: []
      },
      {
        id: 'BUD-005',
        projectId: '',
        referenceDate: '01/06/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Finalizado',
        totalCost: 'R$ 811.450,00',
        services: []
      },
      ]
    },
    {
      code: 'PRJ-003',
      description: 'Conservação rotineira',
      uf: 'GO',
      highway: 'BR-153',
      budgets: [
      {
        id: 'BUD-006',
        projectId: '',
        referenceDate: '01/05/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Finalizado',
        totalCost: 'R$ 876.240,18',
        services: []
      }
      ]
    }
  ];

  getProjects(): Project[] {
    return this.projects;
  }

  getProject(id: string): Project | null {
    return this.projects.find(project => project.code === id) ?? null;
  }

}

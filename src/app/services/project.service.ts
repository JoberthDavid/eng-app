import { Injectable } from '@angular/core';

import { Project } from '../models/project.model';
import { Budget, ServiceItem, CompositionItem } from '../models/budget.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly compositions: CompositionItem[] = [
    {
      code: 'COMP-001',
      description: 'Composição X',
      referenceDate: '01/06/2026',
      factor: 1,
      unitCost: 'R$ 125,40',
      totalCost: 'R$ 125,40',

      auxiliaryCompositions: [
        {
          code: 'COMP-AUX-001',
          description: 'Composição auxiliar nível 1',
          unit: 'un',
          quantity: 1
        }
      ],

      fixedTimeCompositions: [
        {
          code: 'COMP-TF-001',
          description: 'Tempo fixo nível 1',
          unit: 'h',
          quantity: 0.5
        }
      ],

      inputs: [
        {
          id: 1,
          inputGroup: 'EQ',
          genericItem: 'EQ-001',
          genericDescription: 'Equipamento de demonstração',
          unit: 'h',
          inputQuantity: 2,
          inputUse: 1,
          proprietaryItem: null
        },
        {
          id: 2,
          inputGroup: 'MO',
          genericItem: 'MO-001',
          genericDescription: 'Mão de obra de demonstração',
          unit: 'h',
          inputQuantity: 3,
          inputUse: 1,
          proprietaryItem: null
        },
        {
          id: 3,
          inputGroup: 'MA',
          genericItem: 'MA-001',
          genericDescription: 'Material de demonstração',
          unit: 'kg',
          inputQuantity: 10,
          inputUse: 1,
          proprietaryItem: null
        }
      ]
    },

    {
      code: 'COMP-AUX-001',
      description: 'Composição X',
      referenceDate: '01/06/2026',
      factor: 1,
      unitCost: 'R$ 42,50',
      totalCost: 'R$ 42,50',

      auxiliaryCompositions: [
        {
          code: 'COMP-AUX-002',
          description: 'Composição auxiliar nível 2',
          unit: 'un',
          quantity: 2
        }
      ],

      fixedTimeCompositions: [],

      inputs: [
        {
          id: 11,
          inputGroup: 'MO',
          genericItem: 'MO-002',
          genericDescription: 'Operador de demonstração',
          unit: 'h',
          inputQuantity: 1.5,
          inputUse: 1,
          proprietaryItem: null
        },
        {
          id: 12,
          inputGroup: 'MA',
          genericItem: 'MA-002',
          genericDescription: 'Material auxiliar nível 1',
          unit: 'kg',
          inputQuantity: 5,
          inputUse: 1,
          proprietaryItem: null
        }
      ]
    },

    {
      code: 'COMP-AUX-002',
      description: 'Composição X',
      referenceDate: '01/06/2026',
      factor: 1,
      unitCost: 'R$ 18,75',
      totalCost: 'R$ 18,75',

      auxiliaryCompositions: [
        {
          code: 'COMP-AUX-003',
          description: 'Composição auxiliar nível 3',
          unit: 'un',
          quantity: 1
        }
      ],

      fixedTimeCompositions: [],

      inputs: [
        {
          id: 21,
          inputGroup: 'MA',
          genericItem: 'MA-003',
          genericDescription: 'Material auxiliar nível 2',
          unit: 'm',
          inputQuantity: 8,
          inputUse: 1,
          proprietaryItem: null
        }
      ]
    },

    {
      code: 'COMP-AUX-003',
      description: 'Composição X',
      referenceDate: '01/06/2026',
      factor: 1,
      unitCost: 'R$ 31,20',
      totalCost: 'R$ 31,20',

      auxiliaryCompositions: [
        {
          code: 'COMP-AUX-004',
          description: 'Composição auxiliar nível 4',
          unit: 'un',
          quantity: 1
        }
      ],

      fixedTimeCompositions: [],

      inputs: [
        {
          id: 31,
          inputGroup: 'EQ',
          genericItem: 'EQ-003',
          genericDescription: 'Equipamento auxiliar nível 3',
          unit: 'h',
          inputQuantity: 0.8,
          inputUse: 1,
          proprietaryItem: null
        },
        {
          id: 32,
          inputGroup: 'MA',
          genericItem: 'MA-004',
          genericDescription: 'Material auxiliar nível 3',
          unit: 'kg',
          inputQuantity: 4,
          inputUse: 1,
          proprietaryItem: null
        }
      ]
    },

    {
      code: 'COMP-AUX-004',
      description: 'Composição X',
      referenceDate: '01/06/2026',
      factor: 1,
      unitCost: 'R$ 12,80',
      totalCost: 'R$ 12,80',

      auxiliaryCompositions: [],

      fixedTimeCompositions: [],

      inputs: [
        {
          id: 41,
          inputGroup: 'MO',
          genericItem: 'MO-004',
          genericDescription: 'Mão de obra auxiliar nível 4',
          unit: 'h',
          inputQuantity: 0.75,
          inputUse: 1,
          proprietaryItem: null
        }
      ]
    },

    {
      code: 'COMP-TF-001',
      description: 'Composição X',
      referenceDate: '01/06/2026',
      factor: 1,
      unitCost: 'R$ 15,00',
      totalCost: 'R$ 15,00',

      auxiliaryCompositions: [],

      fixedTimeCompositions: [
        {
          code: 'COMP-TF-002',
          description: 'Tempo fixo nível 2',
          unit: 'h',
          quantity: 1
        }
      ],

      inputs: [
        {
          id: 51,
          inputGroup: 'EQ',
          genericItem: 'EQ-TF-001',
          genericDescription: 'Equipamento associado ao tempo fixo',
          unit: 'h',
          inputQuantity: 1,
          inputUse: 1,
          proprietaryItem: null
        }
      ]
    },

    {
      code: 'COMP-TF-002',
      description: 'Composição X',
      referenceDate: '01/06/2026',
      factor: 1,
      unitCost: 'R$ 7,50',
      totalCost: 'R$ 7,50',

      auxiliaryCompositions: [],

      fixedTimeCompositions: [],

      inputs: []
    }
  ];


  private readonly projects: Project[] = [
    {
      id: 'PRJ-001',
      code: 'PRJ-001',
      description: 'Conservação rodoviária',
      uf: 'GO',
      referenceDate: "01/06/2026",
      budgets: [
      {
        id: 'BUD-001',
        projectId: 'PRJ-001',
        referenceDate: '01/07/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Rascunho',
        highway: 'BR-040',
        SNV: [],
        totalCost: '—',
        services: []
      },
      {
        id: 'BUD-002',
        projectId: 'PRJ-001',
        referenceDate: '01/06/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Calculado',
        highway: 'BR-040',
        SNV: [],
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
                description: 'Composição X',
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
                description: 'Composição X',
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
        projectId: 'PRJ-001',
        referenceDate: '01/05/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Finalizado',
        highway: 'BR-040',
        SNV: [],
        totalCost: 'R$ 1.196.420,15',
        services: []
      },
      ]
    },
    {
      id: 'PRJ-002',
      code: 'PRJ-002',
      description: 'Manutenção de pavimento',
      uf: 'DF',
      referenceDate: "01/06/2026",
      budgets: [
      {
        id: 'BUD-004',
        projectId: 'PRJ-002',
        referenceDate: '01/07/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Calculado',
        highway: 'BR-040',
        SNV: [],
        totalCost: 'R$ 845.200,00',
        services: []
      },
      {
        id: 'BUD-005',
        projectId: 'PRJ-002',
        referenceDate: '01/06/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Finalizado',
        highway: 'BR-040',
        SNV: [],
        totalCost: 'R$ 811.450,00',
        services: []
      },
      ]
    },
    {
      id: 'PRJ-003',
      code: 'PRJ-003',
      description: 'Conservação rotineira',
      uf: 'GO',
      referenceDate: "01/06/2026",
      budgets: [
      {
        id: 'BUD-006',
        projectId: 'PRJ-003',
        referenceDate: '01/05/2026',
        methodology: 'SC',
        typeSystem: 'ON',
        status: 'Finalizado',
        highway: 'BR-153',
        SNV: [],
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

  getComposition(code: string): CompositionItem | null {
    return this.compositions.find(
      composition => composition.code === code
    ) ?? null;
  }

  getCompositions(): CompositionItem[] {
    return [...this.compositions];
  }

  getAll(): Project[] {
    return [...this.projects];
  }

  getById(id: string): Project | null {
    return this.projects.find(
      project => project.id === id
    ) ?? null;
  }

  create(project: Project): void {
    this.projects.push(project);
  }

  createBudget(
    projectId: string,
    budget: Budget
  ): void {
    const project = this.projects.find(
      item => item.id === projectId
    );

    if (!project) {
      throw new Error(
        `Projeto não encontrado: ${projectId}`
      );
    }

    project.budgets.push(budget);
  }

  getBudgetById(id: string): Budget | null {
    for (const project of this.projects) {
      const budget = project.budgets.find(
        item => item.id === id
      );

      if (budget) {
        return budget;
      }
    }

    return null;
  }

  addServiceToBudget(
    budgetId: string,
    service: ServiceItem
  ): void {
    const budget = this.getBudgetById(budgetId);

    if (!budget) {
      throw new Error(
        `Orçamento não encontrado: ${budgetId}`
      );
    }

    budget.services.push(service);
  }

  addCompositionToService(
    budgetId: string,
    serviceCode: string,
    composition: CompositionItem
  ): void {
    const budget =
      this.getBudgetById(budgetId);

    if (!budget) {
      throw new Error(
        `Orçamento não encontrado: ${budgetId}`
      );
    }

    const service =
      budget.services.find(
        item => item.code === serviceCode
      );

    if (!service) {
      throw new Error(
        `Serviço não encontrado: ${serviceCode}`
      );
    }

    service.compositions.push(composition);
  }

}
import { Injectable } from '@angular/core';

import {
  AnnualWorkPlanBudget,
  AnnualWorkPlanBudgetGroup,
  AnnualWorkPlanBudgetServiceItem,
  AnnualWorkPlanBudgetComposition
} from '../models/annual-work-plan-budget.models';


@Injectable({
  providedIn: 'root'
})
export class AnnualWorkPlanBudgetService {

  private readonly pato: AnnualWorkPlanBudget = {

    id: 'AWB-001',

    budgetId: 'BUD-002',

    quantityPlanningMode:
      'ANNUAL_WORK_PLAN_BUDGET',

    status:
      'CALCULATED',

    structure: {

      groups: [

        {
          id: 'GRP-01',
          code: '01',
          description:
            'Conservação corretiva rotineira',
          sortOrder: '01',

          services: [

            {
              id: 'SRV-01-01',
              groupId: 'GRP-01',
              code: '01.01',
              description:
                'Conservação corretiva rotineira',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-01-01-001',
                  serviceId: 'SRV-01-01',
                  compositionCode: '1107892',
                  description:
                    'Concreto fck = 20 MPa - confecção em betoneira e lançamento manual',
                  unit: 'm³',
                  factor: '0,1000',
                  sortOrder: '01'
                },

                {
                  id: 'SC-01-01-002',
                  serviceId: 'SRV-01-01',
                  compositionCode: '1604363',
                  description:
                    'Demolição manual de concreto simples',
                  unit: 'm³',
                  factor: '0,2000',
                  sortOrder: '02'
                },

                {
                  id: 'SC-01-01-003',
                  serviceId: 'SRV-01-01',
                  compositionCode: '4915737',
                  description:
                    'Recomposição total de cerca com mourão de madeira',
                  unit: 'm',
                  factor: '0,3500',
                  sortOrder: '03'
                },

                {
                  id: 'SC-01-01-004',
                  serviceId: 'SRV-01-01',
                  compositionCode: '8888353',
                  description:
                    'Transporte de RCUC com taxa de pintura de ligação',
                  unit: 'm³',
                  factor: '0,3500',
                  sortOrder: '04'
                }

              ]
            }

          ]
        },


        {
          id: 'GRP-02',
          code: '02',
          description:
            'Conservação corretiva rotineira - mensal',
          sortOrder: '02',

          services: [

            {
              id: 'SRV-02-01',
              groupId: 'GRP-02',
              code: '02.01',
              description:
                'Conservação mensal por desempenho da faixa de domínio e limpeza de dispositivos de drenagem e de OAC',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-02-01-001',
                  serviceId: 'SRV-02-01',
                  compositionCode: '9999100',
                  description:
                    'Conservação mensal por desempenho',
                  unit: 'mês',
                  factor: '1,0000',
                  sortOrder: '01'
                }

              ]
            }

          ]
        },


        {
          id: 'GRP-03',
          code: '03',
          description:
            'Conservação preventiva periódica',
          sortOrder: '03',

          services: [

            {
              id: 'SRV-03-01',
              groupId: 'GRP-03',
              code: '03.01',
              description:
                'Conservação preventiva periódica',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-03-01-001',
                  serviceId: 'SRV-03-01',
                  compositionCode: '2003319',
                  description:
                    'Sarjeta triangular de concreto',
                  unit: 'm',
                  factor: '1,0000',
                  sortOrder: '01'
                },

                {
                  id: 'SC-03-01-002',
                  serviceId: 'SRV-03-01',
                  compositionCode: '2003377',
                  description:
                    'Meio-fio de concreto',
                  unit: 'm',
                  factor: '0,5000',
                  sortOrder: '02'
                }

              ]
            }

          ]
        },


        {
          id: 'GRP-04',
          code: '04',
          description:
            'Conservação de emergência',
          sortOrder: '04',

          services: [

            {
              id: 'SRV-04-01',
              groupId: 'GRP-04',
              code: '04.01',
              description:
                'Conservação de emergência',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-04-01-001',
                  serviceId: 'SRV-04-01',
                  compositionCode: '1505860',
                  description:
                    'Enrocamento de pedra jogada - pedra de mão comercial',
                  unit: 'm³',
                  factor: '1,0000',
                  sortOrder: '01'
                },

                {
                  id: 'SC-04-01-002',
                  serviceId: 'SRV-04-01',
                  compositionCode: '1505879',
                  description:
                    'Enrocamento de pedra arrumada',
                  unit: 'm³',
                  factor: '1,0000',
                  sortOrder: '02'
                }

              ]
            }

          ]
        },


        {
          id: 'GRP-05',
          code: '05',
          description:
            'Demais serviços de engenharia',
          sortOrder: '05',

          services: [

            {
              id: 'SRV-05-01',
              groupId: 'GRP-05',
              code: '05.01',
              description:
                'Demais serviços de engenharia',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-05-01-001',
                  serviceId: 'SRV-05-01',
                  compositionCode: '0605571',
                  description:
                    'Bueiro metálico sem interrupção de tráfego',
                  unit: 'm',
                  factor: '1,0000',
                  sortOrder: '01'
                },

                {
                  id: 'SC-05-01-002',
                  serviceId: 'SRV-05-01',
                  compositionCode: '0804401',
                  description:
                    'Boca de BSTC',
                  unit: 'un',
                  factor: '1,0000',
                  sortOrder: '02'
                }

              ]
            }

          ]
        },


        {
          id: 'GRP-06',
          code: '06',
          description:
            'Sinalização de obras',
          sortOrder: '06',

          services: [

            {
              id: 'SRV-06-01',
              groupId: 'GRP-06',
              code: '06.01',
              description:
                'Conjunto operacional para sinalização de obras',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-06-01-001',
                  serviceId: 'SRV-06-01',
                  compositionCode: '9999310',
                  description:
                    'Conjunto operacional para sinalização de obras',
                  unit: 'dia',
                  factor: '1,0000',
                  sortOrder: '01'
                }

              ]
            }

          ]
        },


        {
          id: 'GRP-07',
          code: '07',
          description:
            'Sinalização provisória',
          sortOrder: '07',

          services: [

            {
              id: 'SRV-07-01',
              groupId: 'GRP-07',
              code: '07.01',
              description:
                'Pintura de faixa com tinta acrílica emulsionada em água',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-07-01-001',
                  serviceId: 'SRV-07-01',
                  compositionCode: '5214001',
                  description:
                    'Pintura de faixa com tinta acrílica',
                  unit: 'm²',
                  factor: '1,0000',
                  sortOrder: '01'
                }

              ]
            }

          ]
        },


        {
          id: 'GRP-08',
          code: '08',
          description:
            'Transportes',
          sortOrder: '08',

          services: [

            {
              id: 'SRV-08-01',
              groupId: 'GRP-08',
              code: '08.01',
              description:
                'Transportes',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-08-01-001',
                  serviceId: 'SRV-08-01',
                  compositionCode: '5914329',
                  description:
                    'Transporte com caminhão basculante de 6 m³',
                  unit: 'tkm',
                  factor: '1,0000',
                  sortOrder: '01'
                },

                {
                  id: 'SC-08-01-002',
                  serviceId: 'SRV-08-01',
                  compositionCode: '5914343',
                  description:
                    'Transporte com caminhão basculante de 6 m³',
                  unit: 'tkm',
                  factor: '1,0000',
                  sortOrder: '02'
                }

              ]
            }

          ]
        },


        {
          id: 'GRP-09',
          code: '09',
          description:
            'Administração local',
          sortOrder: '09',

          services: [

            {
              id: 'SRV-09-01',
              groupId: 'GRP-09',
              code: '09.01',
              description:
                'Administração local com despesas diversas',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-09-01-001',
                  serviceId: 'SRV-09-01',
                  compositionCode: '9999106',
                  description:
                    'Administração local com despesas diversas',
                  unit: 'ano',
                  factor: '1,0000',
                  sortOrder: '01'
                }

              ]
            }

          ]
        },


        {
          id: 'GRP-10',
          code: '10',
          description:
            'Mobilização e desmobilização',
          sortOrder: '10',

          services: [

            {
              id: 'SRV-10-01',
              groupId: 'GRP-10',
              code: '10.01',
              description:
                'Mobilização e desmobilização',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-10-01-001',
                  serviceId: 'SRV-10-01',
                  compositionCode: '9999500',
                  description:
                    'Custos com mobilização e desmobilização',
                  unit: 'un',
                  factor: '1,0000',
                  sortOrder: '01'
                }

              ]
            }

          ]
        },


        {
          id: 'GRP-11',
          code: '11',
          description:
            'Instalações provisórias e industriais',
          sortOrder: '11',

          services: [

            {
              id: 'SRV-11-01',
              groupId: 'GRP-11',
              code: '11.01',
              description:
                'Instalações provisórias e industriais',
              sortOrder: '01',

              compositions: [

                {
                  id: 'SC-11-01-001',
                  serviceId: 'SRV-11-01',
                  compositionCode: '0903810',
                  description:
                    'Instalação de usina de asfalto',
                  unit: 'un',
                  factor: '1,0000',
                  sortOrder: '01'
                },

                {
                  id: 'SC-11-01-002',
                  serviceId: 'SRV-11-01',
                  compositionCode: '9999400',
                  description:
                    'Canteiro de obras com container',
                  unit: 'un',
                  factor: '1,0000',
                  sortOrder: '02'
                }

              ]
            }

          ]
        }

      ]

    },


    plans: [

      {
        id: 'PATO-2026',
        year: '2026',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        mode: 'INDEPENDENT',
        sourcePlanId: null,

        servicePlans: [

          {
            id: 'PATO-2026-SRV-01-01',
            serviceId: 'SRV-01-01',

            measurement: {
              quantityMode: 'INVENTORY_X_EFFORT',
              inventoryQuantity: '294,4000',
              inventoryUnit: 'km',
              effortLevel: '0,0100',
              effortUnit: 'm/m',
              workQuantity: '2,9440',
              workUnit: 'km',
              justification: ''
            },

            compositions: [
              {
                compositionId: 'SC-01-01-001',
                quantity: '0,2944',
                unitPrice: '467,220',
                totalCost: '137,67'
              },
              {
                compositionId: 'SC-01-01-002',
                quantity: '0,5888',
                unitPrice: '502,760',
                totalCost: '296,03'
              },
              {
                compositionId: 'SC-01-01-003',
                quantity: '1,0304',
                unitPrice: '31,910',
                totalCost: '32,88'
              },
              {
                compositionId: 'SC-01-01-004',
                quantity: '1,0304',
                unitPrice: '3,650',
                totalCost: '3,76'
              }
            ]
          },

          {
            id: 'PATO-2026-SRV-02-01',
            serviceId: 'SRV-02-01',

            measurement: {
              quantityMode: 'INVENTORY_X_EFFORT',
              inventoryQuantity: '12,0000',
              inventoryUnit: 'mês',
              effortLevel: '1,0000',
              effortUnit: 'mês/mês',
              workQuantity: '12,0000',
              workUnit: 'mês',
              justification: ''
            },

            compositions: [
              {
                compositionId: 'SC-02-01-001',
                quantity: '12,0000',
                unitPrice: '80.932,550',
                totalCost: '971.190,60'
              }
            ]
          }

        ]
      },


      {
        id: 'PATO-2027',
        year: '2027',
        startDate: '2027-01-01',
        endDate: '2027-12-31',
        mode: 'INDEPENDENT',
        sourcePlanId: null,

        servicePlans: [

          {
            id: 'PATO-2027-SRV-01-01',
            serviceId: 'SRV-01-01',

            measurement: {
              quantityMode: 'INVENTORY_X_EFFORT',
              inventoryQuantity: '294,4000',
              inventoryUnit: 'km',
              effortLevel: '0,0150',
              effortUnit: 'm/m',
              workQuantity: '4,4160',
              workUnit: 'km',
              justification: ''
            },

            compositions: [
              {
                compositionId: 'SC-01-01-001',
                quantity: '0,4416',
                unitPrice: '467,220',
                totalCost: '206,31'
              },
              {
                compositionId: 'SC-01-01-002',
                quantity: '0,8832',
                unitPrice: '502,760',
                totalCost: '443,99'
              },
              {
                compositionId: 'SC-01-01-003',
                quantity: '1,5456',
                unitPrice: '31,910',
                totalCost: '49,32'
              },
              {
                compositionId: 'SC-01-01-004',
                quantity: '1,5456',
                unitPrice: '3,650',
                totalCost: '5,64'
              }
            ]
          },

          {
            id: 'PATO-2027-SRV-02-01',
            serviceId: 'SRV-02-01',

            measurement: {
              quantityMode: 'INVENTORY_X_EFFORT',
              inventoryQuantity: '12,0000',
              inventoryUnit: 'mês',
              effortLevel: '1,0000',
              effortUnit: 'mês/mês',
              workQuantity: '12,0000',
              workUnit: 'mês',
              justification: ''
            },

            compositions: [
              {
                compositionId: 'SC-02-01-001',
                quantity: '12,0000',
                unitPrice: '80.932,550',
                totalCost: '971.190,60'
              }
            ]
          }

        ]
      },


      {
        id: 'PATO-2028',
        year: '2028',
        startDate: '2028-01-01',
        endDate: '2028-12-31',
        mode: 'REPEAT',
        sourcePlanId: 'PATO-2027',

        servicePlans: []

      }

    ]

  };


  getByBudgetId(
    budgetId: string
  ): AnnualWorkPlanBudget | null {

    if (
      budgetId !== this.pato.budgetId
    ) {
      return null;
    }

    return this.pato;
  }


  requestQuantityCalculation(
    budgetId: string
  ): void {

    console.info(
      'Solicitação de cálculo de quantitativos do PATO:',
      budgetId
    );

  }


  requestBudgetUpdate(
    budgetId: string
  ): void {

    console.info(
      'Solicitação de atualização do orçamento pelo PATO:',
      budgetId
    );

  }


  requestReport(
    budgetId: string
  ): void {

    console.info(
      'Solicitação de relatório PATO:',
      budgetId
    );

  }
      
  addGroup(
    budgetId: string,
    code: string,
    description: string
  ): AnnualWorkPlanBudgetGroup | null {

    if (budgetId !== this.pato.budgetId) {
      return null;
    }

    const groups =
      this.pato.structure.groups;

    const nextSortOrder =
      String(groups.length + 1)
        .padStart(2, '0');

    const group:
      AnnualWorkPlanBudgetGroup = {

      id:
        `GRP-${crypto.randomUUID()}`,

      code:
        code.trim(),

      description:
        description.trim(),

      sortOrder:
        nextSortOrder,

      services: []

    };

    groups.push(group);

    return group;
  }


  addService(
    budgetId: string,
    groupId: string,
    code: string,
    description: string
  ): AnnualWorkPlanBudgetServiceItem | null {

    if (budgetId !== this.pato.budgetId) {
      return null;
    }

    const group =
      this.pato.structure.groups.find(
        item =>
          item.id === groupId
      );

    if (!group) {
      return null;
    }

    const nextSortOrder =
      String(group.services.length + 1)
        .padStart(2, '0');

    const service:
      AnnualWorkPlanBudgetServiceItem = {

      id:
        `SRV-${crypto.randomUUID()}`,

      groupId:
        group.id,

      code:
        code.trim(),

      description:
        description.trim(),

      sortOrder:
        nextSortOrder,

      compositions: []

    };

    group.services.push(service);

    return service;
  }


  addComposition(
    budgetId: string,
    serviceId: string,
    catalogItemId: string,
    compositionCode: string,
    description: string,
    unit: string,
    factor: string
  ): AnnualWorkPlanBudgetComposition | null {

    if (budgetId !== this.pato.budgetId) {
      return null;
    }

    const group =
      this.pato.structure.groups.find(
        item =>
          item.services.some(
            service =>
              service.id === serviceId
          )
      );

    if (!group) {
      return null;
    }

    const service =
      group.services.find(
        item =>
          item.id === serviceId
      );

    if (!service) {
      return null;
    }

    const existingComposition =
      service.compositions.find(
        composition =>
          composition.catalogItemId === catalogItemId
      );

    if (existingComposition) {
      return null;
    }

    const nextSortOrder =
      String(service.compositions.length + 1)
        .padStart(2, '0');

    const composition:
      AnnualWorkPlanBudgetComposition = {

      id:
        `SC-${crypto.randomUUID()}`,

      serviceId:
        service.id,

      catalogItemId,

      compositionCode:
        compositionCode.trim(),

      description:
        description.trim(),

      unit,

      factor:
        factor.trim(),

      sortOrder:
        nextSortOrder

    };

    service.compositions.push(
      composition
    );

    return composition;
  }

  private getNextGroupCode(): string {

    const numericCodes =
      this.pato.structure.groups
        .map(group => Number(group.code))
        .filter(code => Number.isFinite(code));

    const nextCode =
      numericCodes.length > 0
        ? Math.max(...numericCodes) + 1
        : 1;

    return String(nextCode).padStart(2, '0');
  }

  private getNextServiceCode(
    group: AnnualWorkPlanBudgetGroup
  ): string {

    const prefix =
      group.code.padStart(2, '0');

    const serviceNumbers =
      group.services
        .map(service => {
          const parts =
            service.code.split('.');

          return Number(parts[parts.length - 1]);
        })
        .filter(code => Number.isFinite(code));

    const nextNumber =
      serviceNumbers.length > 0
        ? Math.max(...serviceNumbers) + 1
        : 1;

    return `${prefix}.${String(nextNumber).padStart(2, '0')}`;
  }

  private groupCodeExists(
    code: string,
    ignoredGroupId?: string
  ): boolean {

    return this.pato.structure.groups.some(
      group =>
        group.id !== ignoredGroupId &&
        group.code.trim() === code.trim()
    );
  }

  private serviceCodeExists(
    group: AnnualWorkPlanBudgetGroup,
    code: string,
    ignoredServiceId?: string
  ): boolean {

    return group.services.some(
      service =>
        service.id !== ignoredServiceId &&
        service.code.trim() === code.trim()
    );
  }

}
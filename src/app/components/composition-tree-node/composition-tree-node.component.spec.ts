import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionTreeNodeComponent } from './composition-tree-node.component';
import { CompositionTreeNode } from '../../models/composition-tree.model';

describe('CompositionTreeNodeComponent', () => {
  let component: CompositionTreeNodeComponent;
  let fixture: ComponentFixture<CompositionTreeNodeComponent>;

  const mockNode: CompositionTreeNode = {
    composition: {
      code: 'COMP-001',
      description: 'Composição de teste',
      referenceDate: '01/01/2026',
      referenceBaseDate: '01/01/2026',
      factor: 1,
      unitCost: 'R$ 100,00',
      totalCost: 'R$ 100,00',
      auxiliaryCompositions: [],
      fixedTimeCompositions: [],
      inputs: []
    },
    reference: null,
    referenceType: 'ROOT',
    level: 0,
    children: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionTreeNodeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompositionTreeNodeComponent);
    component = fixture.componentInstance;

    component.node = mockNode;

    fixture.detectChanges();
  });

  it('deve criar o componente com um nó válido', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o código da composição', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.node-code')?.textContent)
      .toContain('COMP-001');
  });

  it('deve emitir o nó quando selecionado', () => {
    const emittedNodes: CompositionTreeNode[] = [];

    component.nodeSelected.subscribe(node => {
      emittedNodes.push(node);
    });

    component.selectNode();

    expect(emittedNodes).toEqual([mockNode]);
  });
});
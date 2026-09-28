import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionTreeNodeComponent } from './composition-tree-node.component';

describe('CompositionTreeNodeComponent', () => {
  let component: CompositionTreeNodeComponent;
  let fixture: ComponentFixture<CompositionTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionTreeNodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionTreeComponent } from './composition-tree.component';

describe('CompositionTreeComponent', () => {
  let component: CompositionTreeComponent;
  let fixture: ComponentFixture<CompositionTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

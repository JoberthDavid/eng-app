import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionPanelComponent } from './composition-panel.component';

describe('CompositionPanelComponent', () => {
  let component: CompositionPanelComponent;
  let fixture: ComponentFixture<CompositionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

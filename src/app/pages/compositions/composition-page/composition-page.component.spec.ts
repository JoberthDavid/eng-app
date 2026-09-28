import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionPageComponent } from './composition-page.component';

describe('CompositionPageComponent', () => {
  let component: CompositionPageComponent;
  let fixture: ComponentFixture<CompositionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

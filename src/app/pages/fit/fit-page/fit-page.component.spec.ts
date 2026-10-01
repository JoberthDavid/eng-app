import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitPageComponent } from './fit-page.component';

describe('FitPageComponent', () => {
  let component: FitPageComponent;
  let fixture: ComponentFixture<FitPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

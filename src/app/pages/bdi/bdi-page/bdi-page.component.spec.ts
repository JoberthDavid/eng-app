import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BdiPageComponent } from './bdi-page.component';

describe('BdiPageComponent', () => {
  let component: BdiPageComponent;
  let fixture: ComponentFixture<BdiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BdiPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BdiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

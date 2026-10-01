import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BituminousMaterialsComponent } from './bituminous-materials.component';

describe('BituminousMaterialsComponent', () => {
  let component: BituminousMaterialsComponent;
  let fixture: ComponentFixture<BituminousMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BituminousMaterialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BituminousMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BdiPageComponent } from './bdi-page.component';
import { BdiService } from '../../../services/bdi.service';

describe('BdiPageComponent', () => {
  let component: BdiPageComponent;
  let fixture: ComponentFixture<BdiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BdiPageComponent],
      providers: [
        {
          provide: BdiService,
          useValue: {
            getBdis: () => of([])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BdiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
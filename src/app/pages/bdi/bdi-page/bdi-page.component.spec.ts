import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { BdiPageComponent } from './bdi-page.component';
import { BdiService } from '../../../services/bdi.service';

describe('BdiPageComponent', () => {
  let component: BdiPageComponent;
  let fixture: ComponentFixture<BdiPageComponent>;

  const bdiServiceMock = {
    getBdis: jasmine.createSpy('getBdis').and.returnValue(of([])),
    getBdi: jasmine.createSpy('getBdi'),
    getBdiMethods: jasmine.createSpy('getBdiMethods').and.returnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BdiPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: BdiService,
          useValue: bdiServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BdiPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
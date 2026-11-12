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


  it('deve gerar slug automaticamente a partir do nome do BDI', () => {

    component.novoBdi();

    component.onBdiNameChange('BDI 26,7% ON');

    expect(component.selectedBdi?.name).toBe('BDI 26,7% ON');

    expect(component.selectedBdi?.slug).toBe('bdi-26-7-on');

  });


  it('deve remover acentos e caracteres especiais do slug', () => {

    component.novoBdi();

    component.onBdiNameChange('BDI – Obras Rodoviárias');

    expect(component.selectedBdi?.slug)
      .toBe('bdi-obras-rodoviarias');

  });


  it('deve atualizar o slug quando o nome do BDI for alterado', () => {

    component.novoBdi();

    component.onBdiNameChange('BDI Padrão');

    expect(component.selectedBdi?.slug).toBe('bdi-padrao');

    component.onBdiNameChange('BDI Especial');

    expect(component.selectedBdi?.slug).toBe('bdi-especial');

  });
  
});
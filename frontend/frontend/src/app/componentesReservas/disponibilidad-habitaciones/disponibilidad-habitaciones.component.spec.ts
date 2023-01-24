import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilidadHabitacionesComponent } from './disponibilidad-habitaciones.component';

describe('DisponibilidadHabitacionesComponent', () => {
  let component: DisponibilidadHabitacionesComponent;
  let fixture: ComponentFixture<DisponibilidadHabitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisponibilidadHabitacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisponibilidadHabitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

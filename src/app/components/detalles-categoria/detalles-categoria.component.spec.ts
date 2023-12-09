import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesCategoriaComponent } from './detalles-categoria.component';

describe('DetallesCategoriaComponent', () => {
  let component: DetallesCategoriaComponent;
  let fixture: ComponentFixture<DetallesCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesCategoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetallesCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

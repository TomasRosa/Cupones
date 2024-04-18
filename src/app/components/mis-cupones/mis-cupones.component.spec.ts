import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCuponesComponent } from './mis-cupones.component';

describe('MisCuponesComponent', () => {
  let component: MisCuponesComponent;
  let fixture: ComponentFixture<MisCuponesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisCuponesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisCuponesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

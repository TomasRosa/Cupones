import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscapadasComponent } from './escapadas.component';

describe('EscapadasComponent', () => {
  let component: EscapadasComponent;
  let fixture: ComponentFixture<EscapadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscapadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EscapadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

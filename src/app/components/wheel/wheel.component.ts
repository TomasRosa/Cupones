import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class WheelComponent {
  segments: number[] = [1500, 500, 650, 800, 1000, 300];
  isSpinning: boolean = false;
  @ViewChild('wheel') wheel: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('marker') marker: ElementRef<HTMLDivElement> | undefined;

  constructor(public activeModal: NgbActiveModal) {}

  spinWheel() {
    if (this.isSpinning) {
      return;
    }
    this.isSpinning = true;
  
    const totalTime = Math.random() * 5000 + 3000; // Tiempo aleatorio entre 3 y 8 segundos
    const steps = 100;
    const stepDuration = totalTime / steps;
    let currentStep = 0;
  
    const rotateStep = () => {
      const anglePerStep = 360 / steps;
      const currentRotation = currentStep * anglePerStep;
      if (this.wheel) {
        this.wheel.nativeElement.style.transform = `rotate(${currentRotation}deg)`;
      }
      currentStep++;
  
      if (currentStep < steps) {
        setTimeout(rotateStep, stepDuration);
      } else {
        this.stopWheel();
      }
    };
  
    rotateStep();
  }
  stopWheel() {
    if (this.wheel && this.marker) {
      const currentRotation = this.getRotationDegrees(this.wheel.nativeElement);
      const normalizedRotation = currentRotation >= 0 ? currentRotation : currentRotation + 360;
      const anglePerSegment = 360 / this.segments.length;
      const winningIndex = Math.floor(normalizedRotation / anglePerSegment);
      const winningSegment = this.segments[winningIndex]; // Valor del segmento ganador
      alert(`¡Ganaste ${winningSegment}!`);
      this.isSpinning = false;
      this.activeModal.close();
    }
  }
  
  getSegmentColor(index: number): string {
    return index % 2 === 0 ? '#0d6efd' : '#292b2c';
  }

  getSegmentTransform(index: number): string {
    const angle = 360 / this.segments.length;
    const rotation = angle * index;
    return `rotate(${rotation}deg)`;
  }

  getRotationDegrees(wheel: HTMLDivElement): number {
    const transform = window.getComputedStyle(wheel).getPropertyValue('transform');
    const regex = /rotate\(([\-\d]+)deg\)/;
    const match = transform.match(regex);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0;
  }
}

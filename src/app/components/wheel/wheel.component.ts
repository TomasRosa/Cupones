import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  standalone: true,
  styleUrls: ['./wheel.component.css'],
  imports: [CommonModule]
})
export class WheelComponent {
  segments: number[] = [300, 500, 650, 800, 1000];
  currentSegment: number | null = null;
  isSpinning: boolean = false;

  constructor(public activeModal: NgbActiveModal) {}

  spinWheel() {
    if (this.isSpinning) {
      return;
    }
    this.isSpinning = true;
    const randomIndex = Math.floor(Math.random() * this.segments.length);
    this.currentSegment = this.segments[randomIndex];
    setTimeout(() => {
      alert(`¡Ganaste ${this.currentSegment}!`);
      this.isSpinning = false;
      this.activeModal.close();
    }, 3000); // Duración de la simulación del giro
  }
  getSegmentColor(index: number): string {
    // Retorna el color del segmento basado en el índice
    if (index % 2 == 0) {
      // Los primeros 3 segmentos tendrán el color del theme flatly de Bootswatch
      return '#0d6efd'; // Azul del theme flatly
    } else {
      // Los otros 2 segmentos tendrán el color #292b2c
      return '#292b2c'; // Gris oscuro
    }
  }
  getSegmentTransform(index: number): string {
    const angle = 360 / this.segments.length;
    return `rotate(${angle * index}deg)`;
  }
}

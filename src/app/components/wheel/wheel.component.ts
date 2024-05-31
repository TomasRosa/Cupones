import { CommonModule } from "@angular/common";
import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-wheel",
  templateUrl: "./wheel.component.html",
  styleUrls: ["./wheel.component.css"],
  standalone: true,
  imports: [CommonModule]
})
export class WheelComponent implements AfterViewInit {
  segments: number[] = [1500, 500, 650, 800, 1000, 300, 1250, 1700];
  isSpinning: boolean = false;
  @ViewChild("wheel") wheel: ElementRef<HTMLDivElement> | undefined;
  @ViewChild("marker") marker: ElementRef<HTMLDivElement> | undefined;

  constructor(public activeModal: NgbActiveModal) {}

  ngAfterViewInit() {
    this.adjustSegmentIndices();
  }

  adjustSegmentIndices() {
    if (this.wheel) {
      const segmentIndices = this.wheel.nativeElement.querySelectorAll(".segment-index");
      segmentIndices.forEach((index: Element, i: number) => {
        (index as HTMLElement).textContent = `${i}`;
      });
    }
  }

  spinWheel() {
    if (this.isSpinning) {
      return;
    }
    this.isSpinning = true;
  
    const randomRotations = Math.floor(Math.random() * 5) + 3;
    const randomAngle = randomRotations * 360 + Math.floor(Math.random() * 360);
  
    document.documentElement.style.setProperty('--random-degrees', `${randomAngle}deg`);
  
    if (this.wheel) {
      // Establecer la transformación de la rueda y la transición
      this.wheel.nativeElement.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
      this.wheel.nativeElement.style.transform = `rotate(${randomAngle}deg)`;
  
      // Obtener la duración de la animación de transformación
      const animationDuration = 4 * 1000; // Convertir segundos a milisegundos
  
      // Llamar a la función stopWheel() después de que la animación haya terminado
      setTimeout(() => {
        this.stopWheel();
      }, animationDuration);
    }
  }

  stopWheel() {
    if (this.marker) {
      const markerElement = this.marker.nativeElement;
  
      // Obtener el ángulo de rotación del marcador
      const markerTransform = window.getComputedStyle(markerElement).getPropertyValue("transform");
      if (markerTransform !== 'none') {
        // Calcular el ángulo del marcador
        const markerMatrixValues = markerTransform.split('(')[1].split(')')[0].split(',');
        const markerA = parseFloat(markerMatrixValues[0]);
        const markerB = parseFloat(markerMatrixValues[1]);
        let markerAngle = Math.atan2(markerB, markerA) * (180 / Math.PI);
        if (markerAngle < 0) markerAngle += 360;
  
        // Calcular el ángulo de cada segmento
        const anglePerSegment = 360 / this.segments.length;
  
        // Calcular el índice del segmento en el que se encuentra el marcador
        const segmentIndex = Math.floor(markerAngle / anglePerSegment);
  
        // Obtener el valor del segmento ganador
        const winningSegmentValue = this.segments[segmentIndex];
  
        // Mostrar el resultado en una alerta
        alert(`¡Ganaste ${winningSegmentValue}!`);
  
        // Resetear el estado de la ruleta
        this.isSpinning = false;
        this.activeModal.close();
      } else {
        console.error('No se pudo obtener el ángulo de rotación del marcador');
      }
    } else {
      console.error('El elemento del marcador no se ha encontrado en el DOM');
    }
  }
  
  
  
  getSegmentColor(index: number): string {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#ffffff", "#0f0f0f"];
    return colors[index % colors.length];
  }

  getSegmentTransform(index: number): string {
    const angle = 360 / this.segments.length;
    const rotation = angle * index;
    return `rotate(${rotation}deg) skewY(${90 - angle}deg)`;
  }

  getSegmentRotation(index: number): string {
    const angle = 360 / this.segments.length;
    const rotation = -1 * angle * index; // Rotación inversa para centrar el texto
    return `${rotation}deg`;
  }
}

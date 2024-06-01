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
        this.stopWheel(randomAngle);
      }, animationDuration);
    }
  }

  stopWheel(finalAngle: number) {
    if (this.wheel) {
      // Calcular el ángulo de cada segmento
      const anglePerSegment = 360 / this.segments.length;

      // Calcular el ángulo final de la ruleta
      const totalRotation = finalAngle % 360;
      const normalizedRotation = (360 - totalRotation) % 360;

      // Ajustar el ángulo para corregir el desfase, considerando los 45 grados por segmento
      const adjustedAngle = normalizedRotation + anglePerSegment / 2;

      // Calcular el índice del segmento debajo del marcador
      let segmentIndex = Math.floor((adjustedAngle + anglePerSegment / 2) / anglePerSegment) % this.segments.length;

      // Obtener el valor del segmento ganador
      const winningSegmentValue = this.segments[segmentIndex];

      // Mostrar el resultado en una alerta
      alert(`¡Ganaste ${winningSegmentValue}!`);

      // Resetear el estado de la ruleta
      this.isSpinning = false;
      this.activeModal.close();
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

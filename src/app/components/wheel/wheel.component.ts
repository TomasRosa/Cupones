import { CommonModule } from "@angular/common";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-wheel",
  templateUrl: "./wheel.component.html",
  styleUrls: ["./wheel.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class WheelComponent {
  segments: number[] = [1500, 500, 650, 800, 1000, 300];
  isSpinning: boolean = false;
  @ViewChild("wheel") wheel: ElementRef<HTMLDivElement> | undefined;
  @ViewChild("marker") marker: ElementRef<HTMLDivElement> | undefined;

  constructor(public activeModal: NgbActiveModal) {
    // Obtener el ángulo de rotación por segmento
    const anglePerSegment = 360 / this.segments.length;
    
    // Calcular el ángulo inicial del marcador en el centro del primer segmento
    const initialMarkerAngle = anglePerSegment / 2;
    
    if (this.marker) {
      // Aplicar el ángulo inicial del marcador
      this.marker.nativeElement.style.transform = `rotate(${initialMarkerAngle}deg)`;
    }
  }

  spinWheel() {
    if (this.isSpinning) {
      return;
    }
    this.isSpinning = true;

    // Generar un ángulo de rotación aleatorio entre 3 y 8 vueltas completas
    const randomRotations = Math.floor(Math.random() * 5) + 3;
    const randomAngle = randomRotations * 360 + Math.floor(Math.random() * 360);

    document.documentElement.style.setProperty('--random-degrees', `${randomAngle}deg`);

    console.log(
      `Random Rotations: ${randomRotations}, Random Angle: ${randomAngle}`
    );

    if (this.wheel) {
      this.wheel.nativeElement.style.transition = "none";
      this.wheel.nativeElement.style.transform = `rotate(0deg)`;

      setTimeout(() => {
        this.wheel!.nativeElement.style.transition =
          "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
        this.wheel!.nativeElement.style.transform = `rotate(${randomAngle}deg)`;

        // Verificar el valor aplicado
        setTimeout(() => {
          const appliedTransform = window
            .getComputedStyle(this.wheel!.nativeElement)
            .getPropertyValue("transform");
          console.log(`Applied Transform: ${appliedTransform}`);
        }, 0);
      }, 50);
    }

    setTimeout(() => {
      this.stopWheel(randomAngle);
    }, 4000); // 4 segundos de duración de la animación
  }

  stopWheel(finalRotation: number) {
    if (this.wheel && this.marker) {
      const anglePerSegment = 360 / this.segments.length;
  
      // Normalizar la rotación de la ruleta
      const normalizedRotation = ((finalRotation % 360) + 360) % 360;
  
      // Calcular el ángulo de rotación del marcador
      const markerRotation = 360 - normalizedRotation;
  
      // Aplicar el ángulo de rotación al marcador
      this.marker.nativeElement.style.transform = `rotate(${markerRotation}deg)`;
  
      // Calcular el índice del segmento ganador
      let winningIndex = Math.floor(normalizedRotation / anglePerSegment);
      if (winningIndex < 0) {
        winningIndex += this.segments.length;
      }
  
      // Mostrar alerta con el segmento ganador
      const winningSegment = this.segments[winningIndex];
      alert(`¡Ganaste ${winningSegment}!`);
  
      // Restablecer el estado de la ruleta
      this.isSpinning = false;
      this.activeModal.close();
    }
  }


  getSegmentColor(index: number): string {
    return index % 2 === 0 ? "#0d6efd" : "#292b2c";
  }

  getSegmentTransform(index: number): string {
    const angle = 360 / this.segments.length;
    const rotation = angle * index;
    return `rotate(${rotation}deg)`;
  }

  getRotationDegrees(wheel: HTMLDivElement): number {
    const transform = window
      .getComputedStyle(wheel)
      .getPropertyValue("transform");
    const regex = /rotate\(([-\d.]+)deg\)/;
    const match = transform.match(regex);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0;
  }
}

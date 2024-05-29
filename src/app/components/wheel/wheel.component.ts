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
  segments: number[] = [1500, 500, 650, 800, 1000, 300];
  isSpinning: boolean = false;
  @ViewChild("wheel") wheel: ElementRef<HTMLDivElement> | undefined;
  @ViewChild("marker") marker: ElementRef<HTMLDivElement> | undefined;

  constructor(public activeModal: NgbActiveModal) {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.adjustSegmentIndices();
    }, 100); // Ajusta después de 100 milisegundos
  }

  adjustSegmentIndices() {
    if (this.wheel) {
      const segmentIndices = this.wheel.nativeElement.querySelectorAll(".segment-index");
      segmentIndices.forEach((index: Element, i: number) => {
        console.log("Index:", i, "Text:", (index as HTMLElement).textContent);
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
      this.wheel.nativeElement.style.transition = "none";
      this.wheel.nativeElement.style.transform = `rotate(0deg)`;
  
      setTimeout(() => {
        this.wheel!.nativeElement.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
        this.wheel!.nativeElement.style.transform = `rotate(${randomAngle}deg)`;
  
        setTimeout(() => {
          const appliedTransform = window.getComputedStyle(this.wheel!.nativeElement).getPropertyValue("transform");
          console.log(`Applied Transform: ${appliedTransform}`);
          setTimeout(() => {
            this.stopWheel(); // Llama a stopWheel después de un pequeño retraso
          }, 3250); // Espera 100ms para asegurarte de que el marcador esté disponible
        }, 0);
      }, 50);
    }
  }
  calculateSegmentAngles(): number[] {
    const total = this.segments.reduce((acc, curr) => acc + curr, 0);
    return this.segments.map(segment => (360 * segment) / total);
  }
  stopWheel() {
    if (this.marker && this.wheel) {
      const wheelElement = this.wheel.nativeElement;
      const wheelRadius = wheelElement.clientWidth / 2;
      const markerElement = this.marker.nativeElement;
  
      const markerRect = markerElement.getBoundingClientRect();
      const markerCenterX = markerRect.left + markerRect.width / 2;
      const markerCenterY = markerRect.top + markerRect.height / 2;
      const wheelCenterX = wheelElement.getBoundingClientRect().left + wheelRadius;
      const wheelCenterY = wheelElement.getBoundingClientRect().top + wheelRadius;
      const deltaX = markerCenterX - wheelCenterX;
      const deltaY = markerCenterY - wheelCenterY;
      let markerAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  
      // Ajustamos el ángulo para que esté en el rango de 0 a 360 grados
      markerAngle = (markerAngle < 0 ? markerAngle + 360 : markerAngle);
  
      // Obtenemos los ángulos de cada segmento
      const segmentAngles = this.calculateSegmentAngles();
  
      // Convertimos el ángulo del marcador al índice del segmento
      let cumulativeAngle = 0;
      let winningIndex = 0;
      for (let i = 0; i < segmentAngles.length; i++) {
        cumulativeAngle += segmentAngles[i];
        if (markerAngle <= cumulativeAngle) {
          winningIndex = i;
          break;
        }
      }
  
      // Obtenemos el valor del segmento ganador
      const winningSegmentValue = this.segments[winningIndex];
      console.log("Segmento que salió: ", winningIndex);
      console.log("Valor que salió:", winningSegmentValue);
      alert(`¡Ganaste ${winningSegmentValue}!`);
      this.isSpinning = false;
      this.activeModal.close();
    } else {
      console.error('El marcador o el elemento de la rueda no se han encontrado en el DOM');
    }
  }
  
  
  
  getSegmentColor(index: number): string {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff"];
    return colors[index % colors.length];
  }

  getSegmentTransform(index: number): string {
    const angle = 360 / this.segments.length;
    const rotation = angle * index;
    return `rotate(${rotation}deg)`;
  }
}

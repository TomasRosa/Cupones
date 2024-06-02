import { CommonModule } from "@angular/common";
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../services/auth.service";
import { SharedTicketService } from "../../services/shared-ticket.service";
import { Observable } from "rxjs";
import { Timestamp } from "@angular/fire/firestore";
import { User } from "../../models/user";

@Component({
  selector: "app-wheel",
  templateUrl: "./wheel.component.html",
  styleUrls: ["./wheel.component.css"],
  standalone: true,
  imports: [CommonModule]
})
export class WheelComponent implements AfterViewInit, OnInit   {
  segments: number[] = [1500, 500, 650, 800, 1000, 300, 1250, 1700];
  isSpinning: boolean = false;
  message: string = '';
  showAlert: boolean = false;

  isButtonDisabled: boolean = false; // Nueva variable para desactivar el botón
  
  cantTickets$: Observable<number | null> | null = null;
  ultimoGiro: Date | null = null; // Variable para almacenar la última vez que se giró la ruleta


  @ViewChild("wheel") wheel: ElementRef<HTMLDivElement> | undefined;
  @ViewChild("marker") marker: ElementRef<HTMLDivElement> | undefined;

  constructor(public activeModal: NgbActiveModal,
  private auth: AuthService,
  private sharedTicket: SharedTicketService
  ) {}

  ngAfterViewInit() {
    this.adjustSegmentIndices();
  }
  ngOnInit(): void {
    this.auth.getUserId().subscribe(userId => {
      if (userId) {
        this.auth.getUltimoGiro().then(ultimoGiro => {
          this.ultimoGiro = ultimoGiro;
        });
      }
    });
  }
  
  
  canSpinWheel(): boolean {
    if (this.ultimoGiro==null) {
      // Si es la primera vez que el usuario gira la ruleta, permitir el giro
      return true;
    } else {
      // Calcular el tiempo transcurrido desde el último giro
      const now = new Date();
      const diff = now.getTime() - this.ultimoGiro.getTime();
      const hoursPassed = diff / (1000 * 60 * 60);
      return hoursPassed >= 24;
    }
  }
  async spinWheel() {
    if (this.isSpinning || !this.canSpinWheel()) { // Verifica si está girando o no se puede girar
      return;
    }
    this.isSpinning = true;
    this.isButtonDisabled = true; // Desactiva el botón al iniciar la rueda
  
    const randomRotations = Math.floor(Math.random() * 5) + 3;
    const randomAngle = randomRotations * 360 + Math.floor(Math.random() * 360);
  
    document.documentElement.style.setProperty('--random-degrees', `${randomAngle}deg`);
  
    if (this.wheel) {
      // Establecer la transformación de la rueda y la transición
      this.wheel.nativeElement.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
      this.wheel.nativeElement.style.transform = `rotate(${randomAngle}deg)`;
  
      // Obtener la duración de la animación de transformación
      const animationDuration = 4 * 1000; // Convertir segundos a milisegundos
  
      // Calcular el tiempo restante para el próximo giro
      const now = new Date().getTime();
      const nextSpinTime = this.getNextSpinTime(); // Obtener el tiempo del próximo giro
      const timeLeft = await nextSpinTime - now;
      const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
      // Llamar a la función stopWheel() después de que la animación haya terminado
      setTimeout(() => {
        this.stopWheel(randomAngle);
      }, animationDuration);
  
      // Actualizar el mensaje con el tiempo restante
      this.message = `Debes esperar ${hoursLeft} horas antes de girar nuevamente.`;
      this.showAlert = true;
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
      
      this.message = `¡Ganaste ${winningSegmentValue} tickets!`;
      this.showAlert = true;
      console.log("Message:", this.message);

      this.auth.getCantTickets().subscribe(currentTickets => {
          if(currentTickets != null)
          {
            const newTicketCount = currentTickets + winningSegmentValue
            this.auth.updateCantTickets(newTicketCount);
            this.sharedTicket.setCantTickets(newTicketCount);
          }
      })
      
      // Cerrar el modal después de 3 segundos
      setTimeout(() => {
        this.activeModal.close();
      }, 3000);
  
      // Resetear el estado de la ruleta
      this.isSpinning = false;
    }
  }
  async getNextSpinTime(): Promise<number> {
    const nextSpinTime = await this.auth.getNextSpinTime();
    return nextSpinTime;
  }
  adjustSegmentIndices() {
    if (this.wheel) {
      const segmentIndices = this.wheel.nativeElement.querySelectorAll(".segment-index");
      segmentIndices.forEach((index: Element, i: number) => {
        (index as HTMLElement).textContent = `${i}`;
      });
    }
  }
  getSegmentColor(index: number): string {
    const color1 = "rgb(59, 89, 152)";
    const color2 = "rgb(44, 62, 80)";
    return index % 2 === 0 ? color1 : color2;
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

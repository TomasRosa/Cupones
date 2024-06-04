import { CommonModule } from "@angular/common";
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../services/auth.service";
import { SharedTicketService } from "../../services/shared-ticket.service";
import { Observable, of, switchMap, map, combineLatest } from "rxjs";
import { Timestamp } from "@angular/fire/firestore";

@Component({
  selector: "app-wheel",
  templateUrl: "./wheel.component.html",
  styleUrls: ["./wheel.component.css"],
  standalone: true,
  imports: [CommonModule]
})
export class WheelComponent implements AfterViewInit, OnInit {
  segments: number[] = [1500, 500, 650, 800, 1000, 300, 1250, 1700];
  isSpinning: boolean = false;
  message: string = '';
  showAlert: boolean = false;
  isErrorMessage: boolean = false; // Nueva variable para el estado del mensaje
  isButtonDisabled: boolean = false;
  cantTickets$: Observable<number | null> | null = null;

  @ViewChild("wheel") wheel: ElementRef<HTMLDivElement> | undefined;
  @ViewChild("marker") marker: ElementRef<HTMLDivElement> | undefined;

  constructor(
    public activeModal: NgbActiveModal,
    private auth: AuthService,
    private sharedTicket: SharedTicketService
  ) {}

  ngAfterViewInit() {
    this.adjustSegmentIndices();
  }

  ngOnInit(): void {
    combineLatest([this.auth.getUserId(), this.auth.getUltimoGiro()]).subscribe(([userId, ultimoGiro]) => {
      if (userId) {
        console.log("oninit", ultimoGiro);
        this.updateButtonState(ultimoGiro);
        this.showMessage(ultimoGiro);
      } else {
        this.message = "Debes iniciar sesión para girar la ruleta.";
        this.showAlert = true;
        this.isErrorMessage = true; // Mensaje de error
        this.isButtonDisabled = true;
      }
    });
  }

  updateButtonState(ultimoGiro: Timestamp | null) {
    this.canSpinWheel(ultimoGiro).subscribe(canSpin => {
      this.isButtonDisabled = !canSpin;
    });
  }

  canSpinWheel(ultimoGiro: Timestamp | null): Observable<boolean> {
    console.log("Ultimo giro en canSpinWheel: ", ultimoGiro);
    return of(ultimoGiro).pipe(
      map(ultimoGiro => {
        if (ultimoGiro) {
          const now = Timestamp.now();
          const diff = now.seconds - ultimoGiro.seconds;
          const hoursPassed = diff / (60 * 60); // Convertir a horas
          return hoursPassed >= 24;
        } else {
          return true;
        }
      })
    );
  }

  spinWheel() {
    this.auth.getUltimoGiro().pipe(
      switchMap(ultimoGiro => this.canSpinWheel(ultimoGiro))
    ).subscribe(canSpin => {
      if (!canSpin) {
        this.showMessage(null);
        return;
      }

      if (this.isSpinning || this.isButtonDisabled) {
        return;
      }

      this.isSpinning = true;
      this.isButtonDisabled = true;

      const randomRotations = Math.floor(Math.random() * 5) + 3;
      const randomAngle = randomRotations * 360 + Math.floor(Math.random() * 360);

      document.documentElement.style.setProperty('--random-degrees', `${randomAngle}deg`);

      if (this.wheel) {
        this.wheel.nativeElement.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
        this.wheel.nativeElement.style.transform = `rotate(${randomAngle}deg)`;

        const animationDuration = 4 * 1000;

        setTimeout(() => {
          this.stopWheel(randomAngle);
        }, animationDuration);
      }
    });
  }

  stopWheel(finalAngle: number) {
    if (this.wheel) {
      const anglePerSegment = 360 / this.segments.length;
      const totalRotation = finalAngle % 360;
      const normalizedRotation = (360 - totalRotation) % 360;
      const adjustedAngle = normalizedRotation + anglePerSegment / 2;
      const segmentIndex = Math.floor((adjustedAngle + anglePerSegment / 2) / anglePerSegment) % this.segments.length;
      const winningSegmentValue = this.segments[segmentIndex];

      this.message = `¡Ganaste ${winningSegmentValue} tickets!`;
      this.isErrorMessage = false; // Mensaje de éxito
      this.showAlert = true;
      console.log("Message:", this.message);

      this.auth.getCantTickets().subscribe(currentTickets => {
        if (currentTickets != null) {
          const newTicketCount = currentTickets + winningSegmentValue;
          this.auth.updateCantTickets(newTicketCount);
          this.sharedTicket.setCantTickets(newTicketCount);
        }
      });

      const newGiroTime = Timestamp.now(); // Obtener un Timestamp para la nueva fecha
      this.auth.updateUltimoGiro(newGiroTime);

      setTimeout(() => {
        this.activeModal.close();
      }, 3000);

      this.isSpinning = false;
    }
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
    const rotation = -1 * angle * index;
    return `${rotation}deg`;
  }

  showMessage(ultimoGiro: Timestamp | null) {
    if (ultimoGiro) {
      const now = Timestamp.now();
      const diff = now.seconds - ultimoGiro.seconds;
      const hoursPassed = diff / (60 * 60); // Convertir a horas
      const remainingTime = 24 - hoursPassed;

      if (remainingTime <= 0) {
        this.message = "Puedes girar la ruleta";
        this.isErrorMessage = false; // Mensaje de éxito
        this.isButtonDisabled = false;
        this.showAlert = true;
        return;
      }

      let remainingHours = Math.floor(remainingTime);
      let remainingMinutes = Math.floor((remainingTime - remainingHours) * 60);

      // Ajustar los minutos y horas para evitar el caso 23 horas y 60 minutos
      if (remainingMinutes === 60) {
        remainingHours += 1;
        remainingMinutes = 0;
      }

      if (remainingHours === 0 && remainingMinutes === 0) {
        this.message = "Debes esperar menos de un minuto antes de girar nuevamente.";
      } else if (remainingHours === 0 && remainingMinutes === 1) {
        this.message = "Debes esperar 1 minuto antes de girar nuevamente.";
      } else if (remainingHours === 0) {
        this.message = `Debes esperar ${remainingMinutes} minutos antes de girar nuevamente.`;
      } else if (remainingMinutes === 0) {
        this.message = `Debes esperar ${remainingHours} horas antes de girar nuevamente.`;
      } else if (remainingHours === 1 && remainingMinutes === 1) {
        this.message = `Debes esperar 1 hora y 1 minuto antes de girar nuevamente.`;
      } else if (remainingHours === 1) {
        this.message = `Debes esperar 1 hora y ${remainingMinutes} minutos antes de girar nuevamente.`;
      } else if (remainingMinutes === 1) {
        this.message = `Debes esperar ${remainingHours} horas y 1 minuto antes de girar nuevamente.`;
      } else {
        this.message = `Debes esperar ${remainingHours} horas y ${remainingMinutes} minutos antes de girar nuevamente.`;
      }

      this.isErrorMessage = true; // Mensaje de error
      this.isButtonDisabled = true;
    } else {
      this.message = "Puedes girar la ruleta";
      this.isErrorMessage = false; // Mensaje de éxito
      this.isButtonDisabled = false;
    }
    this.showAlert = true;
  }
}

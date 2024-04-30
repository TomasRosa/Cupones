import { Component, OnInit } from '@angular/core';
import { Lugar } from '../../interfaces/lugar';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-mis-cupones',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './mis-cupones.component.html',
  styleUrl: './mis-cupones.component.css'
})
export class MisCuponesComponent implements OnInit {
  disponibles: boolean = true;
  utilizados: boolean = false;
  cuponesDisponibles: Lugar[] = [];
  cuponesUtilizados: Lugar[] = [];

  constructor(private auth: AuthService, private firestore: FirestoreService) { }

  ngOnInit(): void {
    this.loadCupones();
  }

  loadCupones(): void {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.firestore.getUserCupones(currentUser.uid).subscribe((cupones: { disponibles: Lugar[], utilizados: Lugar[] }) => {
        console.log(cupones);
        this.cuponesDisponibles = cupones.disponibles.map(cupon => {
          const fechaVencimiento = this.calcularFechaVencimiento(cupon.fechaObtenido);
          return {
            ...cupon,
            fechaVencimiento: fechaVencimiento
          };
        });
        this.cuponesUtilizados = cupones.utilizados.map(cupon => {
          const fechaVencimiento = this.calcularFechaVencimiento(cupon.fechaObtenido);
          return {
            ...cupon,
            fechaVencimiento: fechaVencimiento
          };
        });
      }, (error: any) => {
        console.error("Error al cargar los cupones del usuario:", error);
      });
    }
  }


  calcularFechaVencimiento(fechaObtenido: Date | null | undefined): string {
    if (fechaObtenido) {
      const fechaVencimiento = new Date(fechaObtenido); // Crear una nueva instancia de la fecha de obtención
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 7); // Sumar 7 días a la fecha de obtención
      
      // Formatear la fecha de vencimiento como "DD de MMMM de AAAA"
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
      return fechaVencimiento.toLocaleDateString('es-ES', options);
    } else {
      return 'Fecha no disponible';
    }
  }
  formatearFecha(fecha: Date | null | undefined): string {
    if (fecha) {
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
      return fecha.toLocaleDateString('es-ES', options);
    } else {
      return 'Fecha no disponible';
    }
  }
  onChangeDisponibles(): void {
    if (this.disponibles) {
      this.utilizados = false;
    }
  }

  onChangeUtilizados(): void {
    if (this.utilizados) {
      this.disponibles = false;
    }
  }

  moverACuponesUtilizados(cupon: Lugar): void {
    // Remover el cupón de la lista de disponibles
    this.cuponesDisponibles = this.cuponesDisponibles.filter(c => c !== cupon);
    // Agregar el cupón a la lista de utilizados
    this.cuponesUtilizados.push(cupon);
    
    // Obtener el ID del usuario actual
    const currentUser = this.auth.currentUser;
    if (currentUser && currentUser.email) { // Verificar que currentUser y currentUser.email no sean nulos
      this.firestore.getUserIdByEmail(currentUser.email).pipe(
        switchMap(userId => {
          if (userId) {
            // Llamar a addCouponToUserUtilizados dentro del contexto de switchMap
            return this.firestore.addCouponToUserUtilizados(userId, cupon);
          } else {
            console.error("No se encontró el ID del usuario con el correo electrónico proporcionado.");
            throw new Error("ID de usuario no encontrado");
          }
        })
      ).subscribe(() => {
        console.log("Cupón movido a utilizados en Firestore.");
      }, error => {
        console.error("Error al mover el cupón a utilizados en Firestore:", error);
      });
    } else {
      console.error("No se pudo obtener el usuario actual o el correo electrónico es nulo.");
    }
  }
}


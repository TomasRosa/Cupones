import { Component, OnInit } from '@angular/core';
import { Lugar } from '../../interfaces/lugar';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

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
  vencidos: boolean = false;

  cuponesDisponibles: Lugar[] = [];
  cuponesUtilizados: Lugar[] = [];
  cuponesVencidos: Lugar [] = [];


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

  verificarCuponesVencidos(): void {
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Filtrar los cupones disponibles que están vencidos
    const cuponesVencidos = this.cuponesDisponibles.filter(cupon => {
      if (cupon.fechaObtenido) { // Verificar si fechaObtenido no es undefined
        const fechaVencimiento = new Date(cupon.fechaObtenido);
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 7); // Sumar 7 días a la fecha de obtención
        return fechaVencimiento < fechaActual; // Verificar si la fecha de vencimiento es anterior a la fecha actual
      } else {
        return false; // Si fechaObtenido es undefined, el cupón no está vencido
      }
    });
    // Mover los cupones vencidos a la lista de cupones vencidos
    this.cuponesVencidos.push(...cuponesVencidos);
    // Remover los cupones vencidos de la lista de cupones disponibles
    this.cuponesDisponibles = this.cuponesDisponibles.filter(cupon => !cuponesVencidos.includes(cupon));
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
      this.vencidos = false;
    }
  }

  onChangeUtilizados(): void {
    if (this.utilizados) {
      this.disponibles = false;
      this.vencidos = false;
    }
  }

  onChangeVencidos(): void {
    if(this.vencidos)
    {
      this.disponibles = false;
      this.utilizados = false;
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
      this.firestore.getUserIdByEmail(currentUser.email).subscribe(userId => {
        if (userId) {
          // Llamar a addCouponToUserUtilizados
          this.firestore.addCouponToUserUtilizados(userId, cupon, this.cuponesDisponibles).then(() => {
            console.log("Cupón movido a utilizados en Firestore.");
            // Actualizar la lista de cupones disponibles después de que se haya completado la transacción
            this.cuponesDisponibles = this.cuponesDisponibles.filter(c => c !== cupon);
          }).catch(error => {
            console.error("Error al mover el cupón a utilizados en Firestore:", error);
          });
        } else {
          console.error("No se encontró el ID del usuario con el correo electrónico proporcionado.");
        }
      });
    } else {
      console.error("No se pudo obtener el usuario actual o el correo electrónico es nulo.");
    }
  }
}


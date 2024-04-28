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
  cuponesDisponibles: Lugar[] = [];

  constructor(private auth: AuthService, private firestore: FirestoreService) { }

  ngOnInit(): void {
    this.loadCupones();
  }

  loadCupones(): void {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.firestore.getUserCupones(currentUser.uid).subscribe((cupones: Lugar[]) => {
        console.log(cupones);
        this.cuponesDisponibles = cupones.map(cupon => {
          // Asegurémonos de que la fecha de obtención esté en el formato adecuado
          const fechaObtenido = cupon.fechaObtenido ? new Date(cupon.fechaObtenido) : null;
          const fechaVencimiento = this.calcularFechaVencimiento(fechaObtenido); // Pasar la fecha de obtención
          return {
            ...cupon,
            fechaVencimiento: fechaVencimiento,
            fechaObtenido: fechaObtenido // Asignar la fecha original al objeto, sin formatear
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
}


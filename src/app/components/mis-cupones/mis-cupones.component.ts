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
      // Obtener los cupones del usuario actual
      this.firestore.getUserCupones(currentUser.uid).subscribe((cupones: Lugar[]) => {
        console.log(cupones);
        this.cuponesDisponibles = cupones.map(cupon => {
          const fechaObtenido = cupon.fechaObtenido ? cupon.fechaObtenido : null;
          const fechaVencimiento = this.calcularFechaVencimiento(fechaObtenido); // Pasar el timestamp convertido a número
          return {
            ...cupon,
            fechaObtenido: fechaObtenido,
            fechaVencimiento: fechaVencimiento
          };
        });
      }, (error: any) => {
        console.error("Error al cargar los cupones del usuario:", error);
      });
    }
  }
  
  
  convertirMarcaTiempo(timestamp: any): string {
    if (timestamp && timestamp.seconds) {
      const fecha = new Date(timestamp.seconds * 1000);
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
      return fecha.toLocaleDateString('es-ES', options);
    } else {
      // Devuelve una cadena de texto si la marca de tiempo no es válida
      return 'Fecha no disponible';
    }
  }

  calcularFechaVencimiento(fechaObtenido: Date | null): string {
    if (fechaObtenido) {
      const fechaObtenidoDate = new Date(fechaObtenido); // No es necesario multiplicar por 1000
      
      // Verificar si la conversión a Date fue exitosa
      if (!isNaN(fechaObtenidoDate.getTime())) {
        fechaObtenidoDate.setDate(fechaObtenidoDate.getDate() + 7);
        
        // Formatear la fecha de vencimiento como "DD de MMMM de AAAA"
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
        return fechaObtenidoDate.toLocaleDateString('es-ES', options);
      } else {
        return 'Fecha no disponible';
      }
    } else {
      return 'Fecha no disponible';
    }
  }
}


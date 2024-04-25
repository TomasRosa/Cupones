import { Component, OnInit } from '@angular/core';
import { Lugar } from '../../interfaces/lugar';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mis-cupones',
  standalone: true,
  imports: [CommonModule],
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
      this.firestore.getUserCupones(currentUser.uid).then((cupones: any[]) => {
        // Filtrar los cupones según la disponibilidad seleccionada
        if (this.disponibles) {
          this.cuponesDisponibles = cupones.filter((cupon: { utilizado: any; }) => !cupon.utilizado);
        } else if (this.utilizados) {
          this.cuponesDisponibles = cupones.filter((cupon: { utilizado: any; }) => cupon.utilizado);
        }
      }).catch((error: any) => {
        console.error("Error al cargar los cupones del usuario:", error);
      });
    }
  }
}
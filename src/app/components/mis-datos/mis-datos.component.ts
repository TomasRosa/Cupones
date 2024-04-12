import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, of, switchMap, take } from 'rxjs';
import { NavigateToService } from '../../services/navigate-to.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit {
  nombreUsuario: string | null = null;
  apellidoUsuario: string | null = null;
  emailUsuario: string | null = null;
  isUserLoggedIn$!: Observable<boolean>;

  constructor(private auth: AuthService,
  private navigateTo: NavigateToService,
  private firestore: FirestoreService
  ) { }

  ngOnInit(): void {
    this.isUserLoggedIn$ = this.auth.isLoggedIn();

    this.cargarDatosUsuario();
  }
  cargarDatosUsuario() {
    this.isUserLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          console.log("El usuario está logueado");
          return this.auth.getName().pipe(take(1));
        } else {
          console.log("El usuario no está logueado");
          return of(null);
        }
      })
    ).subscribe(name => {
      this.nombreUsuario = name;
    });

    this.isUserLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.auth.getLastName().pipe(take(1));
        } else {
          return of(null);
        }
      })
    ).subscribe(lastName => {
      this.apellidoUsuario = lastName;
    });

    this.isUserLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.auth.getEmail().pipe(take(1));
        } else {
          return of(null);
        }
      })
    ).subscribe(email => {
      this.emailUsuario = email;
    });
  }
  actualizarDatos() {
    if (this.nombreUsuario && this.apellidoUsuario) {
      // Actualizar datos en Firebase Auth
      this.auth.actualizarDatosUsuario(this.nombreUsuario, this.apellidoUsuario)
        .then(() => {
          console.log('Datos actualizados en Firebase Auth.');

          // Actualizar datos en Firestore
          this.firestore.actualizarDatosUsuario(this.auth.currentUser?.uid || '', this.nombreUsuario, this.apellidoUsuario)
            .then(() => {
              console.log('Datos actualizados en Firestore.');

              // Volver a cargar los datos del usuario en el componente
              this.cargarDatosUsuario();
            })
            .catch(error => {
              console.error('Error al actualizar los datos en Firestore:', error);
            });
        })
        .catch(error => {
          console.error('Error al actualizar los datos en Firebase Auth:', error);
        });
    } else {
      console.warn('Nombre y apellido no pueden estar vacíos.');
    }
  }
  navigateTos(ruta: string)
  {
    this.navigateTo.navigateTo(ruta);
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, of, switchMap, take } from 'rxjs';
import { NavigateToService } from '../../services/navigate-to.service';
import { FirestoreService } from '../../services/firestore.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css'],
  imports: [CommonModule,
  FormsModule
  ]
})
export class MisDatosComponent implements OnInit {
  apellidoUsuario: string | null = null;
  nombreUsuario: string | null = null;
  emailUsuario: string | null = null;
  userId: string | null = null;
  editando: boolean = false; // Variable para controlar la edición de campos
  isUserLoggedIn$!: Observable<boolean>;
  
  mensajeMisDatos: string = '';

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
        if(isLoggedIn)
        {
          this.auth.getUserId().subscribe(userId => {
            console.log("Id del usuario actual: ", userId);
          })
          return this.auth.getUserId().pipe(take(1)); // Debes suscribirte al observable aquí
        }
        else
        {
          console.log("El usuario no esta logueado. ");
          return of(null);
        }
      })
    ).subscribe(id => {
      this.userId = id;
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
  toggleEdicion() {
    // Cambiar el estado de la variable editando para habilitar o deshabilitar la edición de campos
    this.editando = !this.editando;
  }
  actualizarDatos() {
    if (this.nombreUsuario && this.apellidoUsuario) {
      // Verifica que nombreUsuario y apellidoUsuario no sean nulos antes de continuar
      if (this.nombreUsuario !== null && this.apellidoUsuario !== null) {
        this.firestore.getUserIdByEmail(this.emailUsuario!).subscribe(userId => {
          if (userId) {
            // Actualizar datos en Firebase Auth
            this.auth.actualizarDatosUsuario(this.nombreUsuario!, this.apellidoUsuario!)
              .then(() => {
                console.log('Datos actualizados en Firebase Auth.');
                // Actualizar datos en Firestore
                this.firestore.actualizarDatosUsuario(userId, this.nombreUsuario!, this.apellidoUsuario!)
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
              })
              .finally(() => {
                // Deshabilitar el botón "Actualizar"
                this.editando = false;
              });
          }
        });
      } 
    } 
  }
  navigateTos(ruta: string)
  {
    this.navigateTo.navigateTo(ruta);
  }
}

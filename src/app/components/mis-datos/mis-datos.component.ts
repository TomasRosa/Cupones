import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, of, switchMap, take } from 'rxjs';
import { NavigateToService } from '../../services/navigate-to.service';
import { FirestoreService } from '../../services/firestore.service';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidacionUserPersonalizada } from '../../validaciones/validacion-user-personalizada';
import { SharedMisDatosService } from '../../services/shared-mis-datos.service';


@Component({
  selector: 'app-mis-datos',
  standalone: true,
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css'],
  imports: [CommonModule,
  FormsModule,
  ReactiveFormsModule
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

  nombreUsuario$: Observable<string | null> | null = null;


  misDatosForm = new FormGroup({
    firstName: new FormControl(this.nombreUsuario,[
      Validators.required,
      ValidacionUserPersonalizada.soloLetras(),
    ]),
    lastName: new FormControl(this.apellidoUsuario, [
      Validators.required,
      ValidacionUserPersonalizada.soloLetras(),
    ])
  })

  constructor(private auth: AuthService,
  private navigateTo: NavigateToService,
  private firestore: FirestoreService,
  private sharedMisDatos: SharedMisDatosService
  ) { }

  get firstName() 
  {
    return this.misDatosForm.get("firstName");
  }
  get lastName() 
  {
    return this.misDatosForm.get("lastName");
  }
  ngOnInit(): void {
    this.editando = false; // Inicializar editando como false

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
    this.editando = !this.editando;
  }
  ///Al mostrarlo, recargar pagina lueg ode ir a inicio.
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
                    this.sharedMisDatos.setNombreUsuario(this.nombreUsuario);
                    console.log('Datos actualizados en Firestore.');
                    this.mensajeMisDatos = 'Haz actualizado tus datos con éxito!';
                    this.hideMessageAfterDelay(2000);
                    this.cargarDatosUsuario();
                  })
                  .catch(error => {
                    this.mensajeMisDatos = 'Ha ocurrido un error al intentar actualizar tus datos.';
                    this.hideMessageAfterDelay(2000);
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
  hideMessageAfterDelay(delay: number) {
    setTimeout(() => {
      this.mensajeMisDatos = "";
      this.navigateTos("/inicio"); // Restablecer el mensaje después del retraso
    }, delay);
  }
}

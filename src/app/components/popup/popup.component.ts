import { Component} from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ValidacionUserPersonalizada } from '../../validaciones/validacion-user-personalizada';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigateToService } from '../../services/navigate-to.service';
import { PopupService } from '../../services/pop-up-service.service';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription, filter, take, of, switchMap } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})

export class PopupComponent
{
    loginForm: FormGroup =  new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required,Validators.minLength(6),ValidacionUserPersonalizada.minDosNumeros()])
    });

    isUserLoggedIn$: Observable<boolean> | undefined; // Definir el tipo de la propiedad
    private authSubscription: Subscription | undefined;

    constructor(private navigateTo: NavigateToService,
    public popupService: PopupService,
    private auth: AuthService,
    private firestore: FirestoreService) {}
    
    ngOnInit(): void {
      this.isUserLoggedIn$ = this.auth.isLoggedIn();
      console.log('PopupComponent - isLoggedIn$', this.isUserLoggedIn$);
      
      this.authSubscription = this.isUserLoggedIn$.subscribe(isLoggedIn => {
        console.log('PopupComponent - isLoggedIn', isLoggedIn);
        if (isLoggedIn) {
          console.log('El usuario está logueado');
        } else {
          console.log('El usuario no está logueado');
        }
      });
    }
  
  ngOnDestroy(): void {
    // Nos aseguramos de desuscribirnos para evitar posibles fugas de memoria
    if (this.authSubscription) {
        this.authSubscription.unsubscribe();
    }
  }
    mensajeLogin: string = ''; 
    loginWithGoogle() {
      this.auth.loginWithGoogle()
        .then(response => {
          const user = response.user;
          const userId = user.uid;
    
          // Verificar si el usuario está registrado en Firestore
          this.firestore.getUserData(userId).subscribe(userData => {
            if (userData) {
              // El usuario está registrado en Firestore, permitir el acceso
              console.log("El usuario está registrado en Firestore");
              this.mensajeLogin = 'Te has logueado con éxito.';
              this.auth.setUserLoggedIn(true);
              setTimeout(() => {
                this.mensajeLogin = '';
                this.navigateTo.navigateTo('/inicio');
                this.closePopup();
              }, 1500);
            } else {
              // El usuario no está registrado en Firestore, mostrar mensaje de registro
              console.log("El usuario no está registrado en Firestore");
              this.mensajeLogin = 'Debes registrarte con Google primero para iniciar sesión con Google. Por favor, hazlo.';
              setTimeout(() => {
                this.mensajeLogin = '';
              }, 2500);
              // Desvincular la cuenta de Google recién autenticada
              user.delete().then(() => {
                console.log('Cuenta de Google recién autenticada desvinculada');
              }).catch(error => {
                console.error('Error al desvincular la cuenta de Google recién autenticada:', error);
              });
            }
          });
        })
        .catch(error => {
          console.error(error);
          this.mensajeLogin = 'Ha ocurrido un error al iniciar sesión con Google.';
          setTimeout(() => {
            this.mensajeLogin = '';
          }, 1500);
        });
    }
    loginWithEmailAndPassword() {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
    
      this.auth.login(email, password)
        .then(() => {
          this.mensajeLogin = 'Te has logueado con éxito.';
          this.auth.setUserLoggedIn(true); // Cambiar el estado de isLoggedIn a true
          setTimeout(() => {
            this.mensajeLogin = '';
            this.navigateTo.navigateTo('/inicio');
            this.closePopup();
          }, 1500); // Cerrar el pop-up después de 1.5 segundos
    
          // Obtener el ID de usuario después de iniciar sesión exitosamente
          this.auth.getUserId().subscribe(userId => {
            if (userId) {
              // Utilizar el ID de usuario para recuperar los datos del usuario desde Firestore
              this.firestore.getUserData(userId).subscribe(userData => {
                if (userData) {
                  // Obtener el nombre de usuario desde los datos del usuario
                  const userName = userData.firstName; // Ajusta esto según cómo se llame el campo de nombre en Firestore
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log(error);
          if (error.code === 'auth/network-request-failed') {
            this.mensajeLogin = 'No se puede conectar al servidor. Por favor, verifica tu conexión a Internet.';
          } else {
            this.mensajeLogin = 'Ha ocurrido un error al intentar loguearte.';
          }
          setTimeout(() => {
            this.mensajeLogin = '';
          }, 2000); // Cerrar el pop-up después de 2 segundos
        });
    }
    get email() {
      return this.loginForm?.get('email');
    }
  
    get password() {
      return this.loginForm?.get('password');
    }
    
    openPopup() 
    {
      this.popupService.open(); // Abre el popup
    }
    closePopup()
    {
      this.popupService.close();
    }
  
    navigateTos(route: string) {
      this.navigateTo.navigateTo(route);
    }
  
}
import { Component} from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ValidacionUserPersonalizada } from '../../validaciones/validacion-user-personalizada';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigateToService } from '../../services/navigate-to.service';
import { PopupService } from '../../services/pop-up-service.service';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription, filter, take, of } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { UserDataService } from '../../services/user-data.service';

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
    private firestore: FirestoreService,
    private userData: UserDataService) {}
    
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
    loginWithEmailAndPassword() {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
    
      this.auth.login(email, password)
        .then(() => {
          this.mensajeLogin = 'Te has logueado con éxito.';
          this.auth.setUserLoggedIn(true); // Cambiar el estado de isLoggedIn a true
          setTimeout(() => {
            this.mensajeLogin = '';
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
                  console.log("Nombre de usuario:", userName);
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
    loginWithGoogle() {
      this.auth.loginWithGoogle()
        .then(response => {
          console.log(response);
          this.mensajeLogin = 'Te has logueado con éxito.';
          this.auth.setUserLoggedIn(true);
          setTimeout(() => {
            this.mensajeLogin = '';
            this.closePopup();
          }, 1500); // Cerrar el pop-up después de 1.5 segundos
    
          const user = response.user;
          const fullName: string = user.displayName || "";
          const names: string[] = fullName.split(" ");
          const firstName = names[0];
          const lastName = names.slice(1).join(" ");
    
          const userId = user.uid;
    
          // Verificar si el usuario ya existe en Firestore
          this.firestore.getUserData(userId).subscribe(userData => {
            if (!userData) {
              // Si el usuario no existe en Firestore, agregarlo
              const usuario = {
                firstName: firstName,
                lastName: lastName,
                email: user.email || "",
                id: userId,
              };
    
              this.firestore.createUser(usuario)
                .then(() => {
                  console.log("Usuario registrado en Firestore correctamente.");
                  // Emitir el nombre de usuario para que se muestre en la navbar
                  this.nombreUsuario$ = of(firstName); // Cambia "nombreUsuario$" por el nombre correcto de tu observable en la navbar
                })
                .catch(error => {
                  console.error("Error al registrar usuario en Firestore:", error);
                });
            } else {
              console.log("El usuario ya existe en Firestore.");
              // Si el usuario ya existe, emitir su nombre de usuario para que se muestre en la navbar
              this.nombreUsuario$ = of(userData.firstName); // Cambia "nombreUsuario$" por el nombre correcto de tu observable en la navbar
            }
          });
        })
        .catch(error => {
          console.log(error);
          this.mensajeLogin = 'Ha ocurrido un error al loguearte con Google.';
          setTimeout(() => {
            this.mensajeLogin = '';
          }, 1500); // Cerrar el pop-up después de 1.5 segundos
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
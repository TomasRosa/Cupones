import { Component} from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ValidacionUserPersonalizada } from '../../validaciones/validacion-user-personalizada';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigateToService } from '../../services/navigate-to.service';
import { PopupService } from '../../services/pop-up-service.service';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';

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
    private auth: AuthService) {}
    
    ngOnInit(): void {
      this.authSubscription = this.auth.isLoggedIn().subscribe(isLoggedIn => {
        this.isUserLoggedIn$ = new Observable(observer => {
          observer.next(isLoggedIn); // Emitir el valor de isLoggedIn
        });
  
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
      const email = this.email?.value;
      const password = this.password?.value;
  
      this.auth.login(email, password)
        .then(response => {
          console.log(response);
          this.mensajeLogin = 'Te has logueado con éxito.';
          this.auth.setUserLoggedIn(true); // Cambiar el estado de isLoggedIn a true
          setTimeout(() => {
            this.mensajeLogin = '';
            this.closePopup();
          }, 1500); // Cerrar el pop-up después de 1.5 segundos
        })
        .catch(error => {
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
  loginWithGoogle() {
    this.auth.loginWithGoogle()
      .then(response => {
        console.log(response);
        this.mensajeLogin = 'Te has logueado con exito.';
        this.auth.isLoggedIn().subscribe(isLoggedIn => {
          // No asignes directamente el observable, emite el valor correspondiente a través del BehaviorSubject
          this.auth.setUserLoggedIn(true); 
        });
        setTimeout(() => {
          this.mensajeLogin = '';
          this.closePopup();
        }, 1500); // Cerrar el pop-up después de 1.5 segundos
        this.navigateTos('/inicio');
      })
      .catch(error => {
        console.log(error);
        this.mensajeLogin = 'Ha ocurrido un error al loguearte con Google.';
        setTimeout(() => {
          this.mensajeLogin = '';
        }, 1500); // Cerrar el pop-up después de 1.5 segundos
      })
  }
}
import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ValidacionUserPersonalizada } from "../../validaciones/validacion-user-personalizada";
import { User } from "../../models/user";
import { NavigateToService } from "../../services/navigate-to.service";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { FirestoreService } from "../../services/firestore.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  mensajeRegistro: string = "";
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;


  constructor(
    private auth: AuthService,
    private navigateTos: NavigateToService,
    private firestore: FirestoreService
  ) {}

  userForm = new FormGroup({
    firstName: new FormControl("", [
      Validators.required,
      ValidacionUserPersonalizada.soloLetras(),
    ]),
    lastName: new FormControl("", [
      Validators.required,
      ValidacionUserPersonalizada.soloLetras(),
    ]),
    email: new FormControl("", [Validators.required, Validators.email]),
    confirmEmail: new FormControl("", [
      Validators.required,
      ValidacionUserPersonalizada.coincideCampo("email"),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      ValidacionUserPersonalizada.minDosNumeros(),
    ]),
    confirmPassword: new FormControl("", [
      Validators.required,
      ValidacionUserPersonalizada.coincideCampo("password"),
    ]),
  });
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  get firstName() {
    return this.userForm.get("firstName");
  }
  get lastName() {
    return this.userForm.get("lastName");
  }
  get email() {
    return this.userForm.get("email");
  }
  get password() {
    return this.userForm.get("password");
  }
  get confirmEmail() {
    return this.userForm.get("confirmEmail");
  }
  get confirmPassword() {
    return this.userForm.get("confirmPassword");
  }
  ///Acordarse de utilizar guards, canActivate, para que no se accedan a distintos metodos si no se esta logueado.
  registerWithEmailAndPassword() {
    if (this.userForm.valid) {
      let usuario: User = new User(
        this.userForm.value.firstName || "",
        this.userForm.value.lastName || "",
        this.userForm.value.email || "",
        this.userForm.value.password || ""
      );

      this.auth
        .register(usuario.email, usuario.password)
        .then((response) => {
          const userId = response.user.uid;

          const userData = {
            firstName: usuario.firstName,
            lastName: usuario.lastName,
            email: usuario.email,
            id: userId,
            coupons: usuario.coupons,
            couponsUtilizados: usuario.couponsUtilizados,
            couponsVencidos: usuario.couponsVencidos,
            cantTickets: usuario.cantTickets
          };

          this.firestore
            .createUser(userData)
            .then(() => {
              this.mensajeRegistro = "Te has registrado correctamente.";
              this.hideMessageAfterDelay(2000); // Ocultar el mensaje después de 2 segundos
            })
            .catch((error) => {
                this.mensajeRegistro = "Ha ocurrido un error al registrarte.";
                console.error("Error al registrar usuario en Firestore:", error);
            });
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            this.mensajeRegistro = "El correo electrónico ya está en uso.";
          }
          else
          {
            this.mensajeRegistro = "Ha ocurrido un error al registrarte.";
            console.error("Error al registrar usuario:", error);
          }
        });
    }
  }
  registerWithGoogle(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.auth.loginWithGoogle()
        .then(response => {
          const user = response.user;
          const userId = user.uid;
  
          // Obtener la referencia al documento del usuario en Firestore
          const userDocRef$ = this.firestore.getUserData(userId);
  
          // Suscribirse al observable para obtener los datos del usuario
          userDocRef$.subscribe(doc => {
            if (doc) {
              // El usuario está registrado en Firestore, mostrar mensaje de que inicie sesión
              console.log("El usuario está registrado en Firestore");
              this.mensajeRegistro = 'Esta cuenta ya está registrada con Google. Por favor, inicia sesión.';
              setTimeout(() => {
                this.mensajeRegistro = '';
              }, 2500);
              // Desloguear al usuario
              this.auth.logout().then(() => resolve()).catch((error: any) => reject(error));
            } else {
              // El usuario no está registrado en Firestore, guardar su usuario en Firestore
              console.log("El usuario no está registrado en Firestore");
  
              const userData = {
                firstName: user.displayName ? user.displayName.split(' ')[0] : '',
                lastName: user.displayName ? user.displayName.split(' ')[1] : '',
                email: user.email || '',
                id: userId,
                coupons: [],
                couponsUtilizados:[],
                cantTickets: 0,
                couponsVencidos:[] // Inicializar como un array vacío
              };
  
              this.firestore.createUser(userData).then(() => {
                console.log('Usuario creado correctamente en Firestore');
                this.mensajeRegistro = "Te has registrado correctamente con Google.";
                setTimeout(() => {
                  this.mensajeRegistro = '';
                }, 2500);
                // Desloguear al usuario después de registrarse correctamente en Firestore
                this.auth.logout().then(() => resolve()).catch((error: any) => reject(error));
              }).catch((error: any) => {
                console.error('Error al crear el usuario en Firestore:', error);
                reject(error);
              });
            }
          }, (error: any) => {
            console.error("Error al obtener datos del usuario en Firestore:", error);
            reject(error);
          });
        })
        .catch((error: any) => {
          console.error("Error al registrar con Google:", error);
          this.mensajeRegistro = "Ha ocurrido un error al registrar con Google.";
          reject(error);
        });
    });
  }
  hideMessageAfterDelay(delay: number) {
    setTimeout(() => {
      this.mensajeRegistro = "";
      this.navigateTos.navigateTo("/inicio"); // Restablecer el mensaje después del retraso
    }, delay);
  }
}

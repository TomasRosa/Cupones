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
import { RecaptchaModule } from "ng-recaptcha";
import { AuthService } from "../../services/auth.service";
import { FirestoreService } from "../../services/firestore.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RecaptchaModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  mensajeRegistro: string = "KAKAROTO";

  constructor(
    private auth: AuthService,
    private navigateTos: NavigateToService,
    private firestore: FirestoreService,
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
          this.mensajeRegistro = "Ha ocurrido un error al registrarte.";
          console.error("Error al registrar usuario:", error);
        });
    }
  }

  registerWithGoogle() {
    this.auth
      .loginWithGoogle()
      .then((response) => {
        const user = response.user;
        const fullName: string = user.displayName || "";
        const names: string[] = fullName.split(" ");
        const firstName = names[0];
        const lastName = names.slice(1).join(" ");

        const userId = user.uid;

        const usuario = {
          firstName: firstName,
          lastName: lastName,
          email: user.email || "",
          id: userId,
        };

        this.firestore
          .createUser(usuario)
          .then(() => {
            this.mensajeRegistro =
              "Te has registrado correctamente con google.";
            this.hideMessageAfterDelay(2000); // Ocultar el mensaje después de 2 segundos
          })
          .catch((error) => {
            console.error("Error al registrar usuario en Firestore:", error);
            this.mensajeRegistro = "Ha ocurrido un error al registrarte.";
          });
      })
      .catch((error) => {
        console.error(error);
        this.mensajeRegistro =
          "Ha ocurrido un error al registrarte con Google.";
      });
  }

  hideMessageAfterDelay(delay: number) {
    setTimeout(() => {
      this.mensajeRegistro = "";
      this.navigateTos.navigateTo("/inicio"); // Restablecer el mensaje después del retraso
    }, delay);
  }
}

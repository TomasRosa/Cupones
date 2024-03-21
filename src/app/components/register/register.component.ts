import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ValidacionUserPersonalizada } from '../../validaciones/validacion-user-personalizada';
import { User } from '../../models/user';
import { NavigateToService } from '../../services/navigate-to.service';
import { CommonModule } from '@angular/common';
import { RecaptchaModule} from 'ng-recaptcha';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RecaptchaModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  mensajeRegistro: string = '';
  
  constructor(private auth: AuthService,
  private navigateTos: NavigateToService) {}

  userForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      ValidacionUserPersonalizada.soloLetras(),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      ValidacionUserPersonalizada.soloLetras(),
    ]),
    email: new FormControl('', [
      Validators.required, 
      Validators.email]),
    confirmEmail: new FormControl('',[
      Validators.required,
      ValidacionUserPersonalizada.coincideCampo('email')]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      ValidacionUserPersonalizada.minDosNumeros(),
    ]),
    confirmPassword: new FormControl('',[
      Validators.required,
      ValidacionUserPersonalizada.coincideCampo('password')]),
  });

  get firstName() {
    return this.userForm.get('firstName');
  }
  get lastName() {
    return this.userForm.get('lastName');
  }
  get email() {
    return this.userForm.get('email');
  }
  get password() {
    return this.userForm.get('password');
  }
  get confirmEmail()
  {
    return this.userForm.get('confirmEmail');
  }
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }
  ///Acordarse de utilizar guards, canActivate, para que no se accedan a distintos metodos si no se esta logueado.
  registerWithEmailAndPassword() {
    if (this.userForm.valid) 
    {
      let usuario: User = {
        firstName: this.userForm.value.firstName || '', // Usa '' si el valor es null o undefined
        lastName: this.userForm.value.lastName || '',
        email: this.userForm.value.email || '',
        password: this.userForm.value.password || '',
      };
      this.auth.register(usuario.email,usuario.password)
      .then(response => {
        console.log(response);
        this.mensajeRegistro = 'Te has registrado correctamente. ';
        this.navigateTos.navigateTo('/inicio');
      })
      .catch(error => {
        console.log(error);
        this.mensajeRegistro = 'Ha ocurrido un error al registrarte.';
      })
    }}

    registerWithGoogle()
    {
      
    }
}
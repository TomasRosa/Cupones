import { environment } from '../../environments/environment';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ValidacionUserPersonalizada } from '../../validaciones/validacion-user-personalizada';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { RecaptchaModule} from 'ng-recaptcha';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { AppEnvironment } from '../../AppEnvironment/AppEnvironment'//nuevo

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RecaptchaModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  mensajeRegistro: string = '';
  
  constructor(private recaptchaV3Service: ReCaptchaV3Service) {}

  environment: AppEnvironment = environment; //nuevo

  async onSubmit() 
  {
    const recaptchaToken = await this.recaptchaV3Service.execute('action');
  
    // Envía recaptchaToken junto con otros datos al servidor para la verificación.
  }

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
    recaptcha: new FormControl('',[
      Validators.required
    ]) 
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

  crearUsuario() {
    // Verifica que el formulario sea válido antes de crear el usuario
    if (this.userForm.valid) 
    {
      let usuario: User = {
        firstName: this.userForm.value.firstName || '', // Usa '' si el valor es null o undefined
        lastName: this.userForm.value.lastName || '',
        email: this.userForm.value.email || '',
        password: this.userForm.value.password || '',
      };
      console.log(usuario);
      if(usuario)
      {
        this.mensajeRegistro = 'Te has registrado con exito.'
      }
     
    }}
}
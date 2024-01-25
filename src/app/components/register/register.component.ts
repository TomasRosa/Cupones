import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ValidacionUserPersonalizada } from '../../validaciones/validacion-user-personalizada';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  mensajeRegistro: string = '';

  userForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      ValidacionUserPersonalizada.soloLetras(),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      ValidacionUserPersonalizada.soloLetras(),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      ValidacionUserPersonalizada.minDosNumeros(),
    ]),
    DNI: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
      ValidacionUserPersonalizada.soloNumeros(),
    ]),
  });

  get firstName() {
    return this.userForm.get('firstName');
  }
  get lastName() {
    return this.userForm.get('lastName');
  }
  get dni() {
    return this.userForm.get('DNI');
  }
  get email() {
    return this.userForm.get('email');
  }
  get password() {
    return this.userForm.get('password');
  }

  crearUsuario() {
    // Verifica que el formulario sea válido antes de crear el usuario
    if (this.userForm.valid) {
      let usuario: User = {
        firstName: this.userForm.value.firstName || '', // Usa '' si el valor es null o undefined
        lastName: this.userForm.value.lastName || '',
        email: this.userForm.value.email || '',
        password: this.userForm.value.password || '',
        dni: this.userForm.value.DNI || ''
      };

      console.log(usuario);
    }}
}

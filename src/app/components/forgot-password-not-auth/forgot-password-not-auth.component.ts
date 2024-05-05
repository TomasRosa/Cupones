import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password-not-auth',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './forgot-password-not-auth.component.html',
  styleUrl: './forgot-password-not-auth.component.css'
})
export class ForgotPasswordNotAuthComponent {
  email: string = '';
  errorMessage: string= '';
  succesfullMessage: string = '';

  constructor(private auth: AuthService) { }

  async sendPasswordResetEmail() {
    try {
      // Verificar si el correo electrónico existe en Firestore
      console.log("ANTES ASINCRONIAA");
      const exists = await this.auth.checkEmailExists(this.email);
      if (exists) {
        // Si el correo electrónico existe, enviar el correo electrónico de restablecimiento de contraseña
        await this.auth.sendPasswordResetEmail(this.email).toPromise();
        console.log('Correo electrónico de restablecimiento de contraseña enviado.');
        this.email = '';
         this.succesfullMessage = 'Correo electrónico de restablecimiento de contraseña enviado.';
         this.hideMessageAfterDelay(2000,this.succesfullMessage);
      } 
      else 
      {
        // Si el correo electrónico no existe, mostrar un mensaje de error
        console.log('El correo electrónico ingresado no está registrado.')
         this.errorMessage = 'El correo electrónico ingresado no está registrado.';
         this.hideMessageAfterDelay(2000,this.errorMessage);
      }
    } catch (error) {
      console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
      // Mostrar el mensaje de error recibido del servicio de autenticación
       this.errorMessage = 'Error al enviar el correo electrónico de restablecimiento de contraseña.';
      this.hideMessageAfterDelay(2000,this.errorMessage);
    }
    console.log("LUEGO ASINCRONIAA");
  }
  hideMessageAfterDelay(delay: number, message: string) {
    setTimeout(() => {
      message = "";
    }, delay);
  }
}

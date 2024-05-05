import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-forgot-password-not-auth',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  styleUrls: ['./forgot-password-not-auth.component.css'],
  templateUrl: './forgot-password-not-auth.component.html'
})
export class ForgotPasswordNotAuthComponent {
  email: string = '';
  errorMessage: string= '';
  succesfullMessage: string = '';

  constructor(private auth: AuthService,
    private firestore: FirestoreService
  ) { }

  async sendPasswordResetEmail() {
    try {
      // Verificar si el correo electrónico existe en Firestore
      const exists = await this.firestore.checkEmailExists(this.email);
      if (exists) {
        // Si el correo electrónico existe, enviar el correo electrónico de restablecimiento de contraseña
        await this.auth.sendPasswordResetEmail(this.email).toPromise();
        console.log('Correo electrónico de restablecimiento de contraseña enviado.');
         this.email = '';
         this.succesfullMessage = 'Correo electrónico de restablecimiento de contraseña enviado.';
         this.hideMessageAfterDelaySuccesfull(2000);
      } 
      else 
      {
        // Si el correo electrónico no existe, mostrar un mensaje de error
         console.log('El correo electrónico ingresado no está registrado.')
         this.errorMessage = 'El correo electrónico ingresado no está registrado.';
         this.hideMessageAfterDelayError(2000);
      }
    } catch (error) {
      console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
      // Mostrar el mensaje de error recibido del servicio de autenticación
      this.errorMessage = 'Error al enviar el correo electrónico de restablecimiento de contraseña.';
      this.hideMessageAfterDelayError(2000);
    }
  }
  hideMessageAfterDelaySuccesfull(delay: number) {
    setTimeout(() => {
      this.succesfullMessage = "";
    }, delay);
  }
  hideMessageAfterDelayError(delay: number) {
    setTimeout(() => {
      this.errorMessage = "";
    }, delay);
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  errorMessage: string= '';
  succesfullMessage: string = '';

  constructor(private auth: AuthService) { }
  
  async sendPasswordResetEmail() {
    try {
      // Utilizar directamente el correo electrónico del usuario autenticado
      const email = this.auth.currentUser?.email;
      if (email) {
        await this.auth.sendPasswordResetEmail(email).toPromise();
         this.succesfullMessage = 'Correo electrónico de restablecimiento de contraseña enviado.';
         this.hideMessageAfterDelaySuccesfull(2000);
      } else {
        this.errorMessage = 'Error al enviar el correo electrónico de restablecimiento de contraseña.';
        this.hideMessageAfterDelayError(2000);
      }
    } catch (error) {
      console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
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
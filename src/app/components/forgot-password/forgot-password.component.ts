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

  constructor(private auth: AuthService) { }

  async sendPasswordResetEmail() {
    try {
      // Utilizar directamente el correo electrónico del usuario autenticado
      const email = this.auth.currentUser?.email;
      if (email) {
        await this.auth.sendPasswordResetEmail(email).toPromise();
        console.log('Correo electrónico de restablecimiento de contraseña enviado.');
      } else {
        console.error('No se pudo obtener el correo electrónico del usuario autenticado.');
      }
    } catch (error) {
      console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
    }
  }
}
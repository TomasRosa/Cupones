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
  email: string = '';

  constructor(private auth: AuthService) { }

  async sendPasswordResetEmail() {
    try {
      await this.auth.sendPasswordResetEmail(this.email).toPromise();
      console.log('Correo electrónico de restablecimiento de contraseña enviado.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
    }
  }
}
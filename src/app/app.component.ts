import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FirebaseModule } from './firebase/firebase.module'; 
import { RecaptchaModule} from 'ng-recaptcha';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    NavbarComponent,
    FirebaseModule,
    RecaptchaModule // Usa tu módulo personalizado aquí
  ]
})
export class AppComponent {
}
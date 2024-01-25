import { Component, ElementRef} from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ValidacionUserPersonalizada } from '../../validaciones/validacion-user-personalizada';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigateToService } from '../../services/navigate-to.service';
import { PopupService } from '../../services/pop-up-service.service';


@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})

export class PopupComponent
{
    loginForm: FormGroup =  new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required,Validators.minLength(6),ValidacionUserPersonalizada.minDosNumeros()])
    });

  constructor(private navigateTo: NavigateToService,public popupService: PopupService, private el: ElementRef ) 
  {
    console.log('PopupComponent cargado.');
  }
  openPopup() 
  {
    console.log('Abriendo pop-up...');
    this.popupService.open(); // Abre el popup
  }
  closePopup()
  {
    console.log('Cerrando pop-up...');
    this.popupService.close();
  }

  navigateTos(route: string) {
    this.navigateTo.navigateTo(route);
  }
  get email() {
    // Comprobación de nulidad
    return this.loginForm?.get('email');
  }

  get password() {
    // Comprobación de nulidad
    return this.loginForm?.get('password');
  }
}
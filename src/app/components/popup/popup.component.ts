import { Component, ElementRef} from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ValidacionUserPersonalizada } from '../../validaciones/validacion-user-personalizada';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigateToService } from '../../services/navigate-to.service';
import { PopupService } from '../../services/pop-up-service.service';
import { AuthService } from '../../services/auth.service';

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

  constructor(private navigateTo: NavigateToService,
  public popupService: PopupService, 
  private el: ElementRef,
  private auth: AuthService) {}
  
  mensajeLogin: string = ''; 

  get email() {
    return this.loginForm?.get('email');
  }

  get password() {
    return this.loginForm?.get('password');
  }
  
  openPopup() 
  {
    this.popupService.open(); // Abre el popup
  }
  closePopup()
  {
    this.popupService.close();
  }

  navigateTos(route: string) {
    this.navigateTo.navigateTo(route);
  }
  
  loginWithEmailAndPassword()
  {
    this.auth.login(this.email,this.password)
    .then(response =>{
      console.log(response);
      this.mensajeLogin = 'Te has logueado con exito. ';
    })
    .catch(error => {
      console.log(error)
      this.mensajeLogin = 'Ha ocurrido un error al intentar loguearte. ';
    })
  }
}
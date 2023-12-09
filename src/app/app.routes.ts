import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';

export const routes: Routes = [{path:'register', title: 'register',component: RegisterComponent},
{path: 'login', title: 'login', component: LoginComponent},
{path:'inicio',title:'inicio',component: InicioComponent}];

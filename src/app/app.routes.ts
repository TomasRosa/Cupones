import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [{path:'register', title: 'register',component: RegisterComponent},{path: 'login', title: 'login', component: LoginComponent},{path: 'gastronomia', title: 'gastronomia', component: LoginComponent}];

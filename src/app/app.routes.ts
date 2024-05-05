import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { GastronomiaComponent } from './components/categorias/gastronomia/gastronomia.component';
import { SupermercadoComponent } from './components/categorias/supermercado/supermercado.component';
import { CineComponent } from './components/categorias/cine/cine.component';
import { EscapadasComponent } from './components/categorias/escapadas/escapadas.component';
import { VehiculosComponent } from './components/categorias/vehiculos/vehiculos.component';
import { TeatroComponent } from './components/categorias/teatro/teatro.component';
import { SaludComponent } from './components/categorias/salud/salud.component';
import { EsteticaComponent } from './components/categorias/estetica/estetica.component';
import { EntretenimientoComponent } from './components/categorias/entretenimiento/entretenimiento.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DetallesComponent } from './components/detalles/detalles.component';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { MisCuponesComponent } from './components/mis-cupones/mis-cupones.component';
import { ForgotPasswordNotAuthComponent } from './components/forgot-password-not-auth/forgot-password-not-auth.component';

export const routes: Routes = [{path:'', title: 'Inicio',component: InicioComponent},
{path:'inicio', title: 'Inicio',component: InicioComponent},
{path:'register', title: 'Registrarse',component: RegisterComponent},
{path:'gastronomia',title:'Gastronomia',component: GastronomiaComponent},
{path:'supermercado',title:'Supermercado',component: SupermercadoComponent},
{path:'escapadas',title:'Escapadas y Hoteles',component: EscapadasComponent},
{path:'cine',title:'Cine',component: CineComponent},
{path:'vehiculos',title:'Vehículos',component: VehiculosComponent},
{path:'teatro',title:'Teatro',component: TeatroComponent},
{path:'salud',title:'Salud',component: SaludComponent},
{path:'estetica',title:'Estética',component: EsteticaComponent},
{path:'entretenimiento',title:'Entretenimiento',component: EntretenimientoComponent},
{path: 'forgot-password', title:'Recuperar contraseña', component:ForgotPasswordComponent},
{path: 'detalles', title:'Detalles', component: DetallesComponent},
{path: 'mis-datos', title:'Mis datos', component: MisDatosComponent},
{path: 'detalles/:id', title:'Detalles', component: DetallesComponent},
{path: 'new-password',title: 'Olvide mi contraseña', component:ForgotPasswordNotAuthComponent},
{path: 'mis-cupones', title:'Mis cupones', component: MisCuponesComponent}];

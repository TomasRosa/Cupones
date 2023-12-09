import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CategoriaComponent } from './components/categoria/categoria.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterLink,NavbarComponent],
  templateUrl: './app.component.html',
  template: `
  <app-categoria [nombre]="categoriaGastronomia"></app-categoria>
  <app-categoria [nombre]="categoriaSupermercado"></app-categoria>
  <app-categoria [nombre]="categoriaEscapadasYHoteles"></app-categoria>
  <app-categoria [nombre]="categoriaCine"></app-categoria>
  <app-categoria [nombre]="categoriaVehiculos"></app-categoria>
  <app-categoria [nombre]="categoriaTeatro"></app-categoria>
  <app-categoria [nombre]="categoriaSalud"></app-categoria>
  <app-categoria [nombre]="categoriaEsteticaYBelleza"></app-categoria>
  <app-categoria [nombre]="categoriaEntretenimiento"></app-categoria>
`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  categoriaGatronomia = 'Gastronomia';
  categoriaSupermercado = 'Supermercado';
  categoriaEscapadasYHoteles = 'EscapadasYHoteles';
  categoriaCine = 'Cine';
  categoriaVehiculos = 'Vehiculos';
  categoriaTeatro = 'Teatro';
  categoriaSalud = 'Salud';
  categoriaEsteticaYBelleza = 'Estetica';
  categoriaEntretenimiento = 'Entretenimiento';

}

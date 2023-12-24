import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gastronomia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gastronomia.component.html',
  styleUrl: './gastronomia.component.css'
})
export class GastronomiaComponent {
  gastronomia: any [] = [
  {
    nombre: 'Del Fuerte',
    descripcion: 'Lorem ipsum, dolor sit amet consectetur',
    imagen: 'assets/images/images-gastronomia/del-fuerte-tandil.jpg',
    precio: '$500',
  },
  {
    nombre: 'El Molino',
    descripcion: 'Lorem ipsum, dolor sit amet consectetur',
    imagen: 'assets/images/images-gastronomia/el-molino-tandil.jpg',
    precio: '$500',
  },
  {
    nombre: 'La Cuadra',
    descripcion: 'Lorem ipsum, dolor sit amet consectetur',
    imagen: 'assets/images/images-gastronomia/la-cuadra-tandil.jpg',
    precio: '$500',
  }
]
}

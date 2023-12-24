import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.css'
})
export class VehiculosComponent {
  vehiculos: any [] = [
    {
      nombre: 'Concesionaria Motos',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-vehiculos/motos-consecionaria.JPG',
      precio: '$500',
    },
    {
      nombre: 'Concesionaria Renault',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-vehiculos/renault-consecionaria.jpg',
      precio: '$500',
    },
    {
      nombre: 'Concesionaria San Jorge',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-vehiculos/san-jorge-consecionarias.jpg',
      precio: '$500'
    }
  ]
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cine.component.html',
  styleUrl: './cine.component.css'
})
export class CineComponent {
  cine: any [] = [
    {
      nombre: 'Cinemacenter',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-cine/cinemacenter.jpg',
      precio: '$500',
    },
    {
      nombre: 'Espacio Incaa',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-cine/espacio-incaa.jpeg',
      precio: '$500',
    },
    {
      nombre: 'Gallegos Mar del Plata',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-cine/gallegos-mdp.jpg',
      precio: '$500',
    }
  ]
}

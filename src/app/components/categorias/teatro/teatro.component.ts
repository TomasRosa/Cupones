import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teatro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teatro.component.html',
  styleUrl: './teatro.component.css'
})
export class TeatroComponent {
  teatro: any [] = [
    {
      nombre: 'Teatro Bajo Suelo',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-teatro/teatro-bajo-suelo.jpg',
      precio: '$500',
    },
    {
      nombre: 'Teatro Confraternidad',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-teatro/teatro-confraternidad.jpg',
      precio: '$500',
    },
    {
      nombre: 'Teatro Del Fuerte',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-teatro/teatro-del-fuerte.jpg',
      precio: '$500'
    }
  ]
}

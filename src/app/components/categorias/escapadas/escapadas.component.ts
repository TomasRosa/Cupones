import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-escapadas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './escapadas.component.html',
  styleUrl: './escapadas.component.css'
})
export class EscapadasComponent {
  escapadas: any [] = [
    {
      nombre: 'Hotel Francia',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-escapadas/hotel-francia.webp',
      precio: '$500',
    },
    {
      nombre: 'Hotel Nuevos Horizontes',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-escapadas/hotel-nuevos-horizontes.webp',
      precio: '$500',
    },
    {
      nombre: 'Hotel Paraiso de la Sierra',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-escapadas/hotel-paraiso-de-la-sierra.webp',
      precio: '$500'
    }
  ]
}

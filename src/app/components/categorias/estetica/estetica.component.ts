import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estetica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estetica.component.html',
  styleUrl: './estetica.component.css'
})
export class EsteticaComponent {
  estetica: any [] = [
    {
      nombre: 'Estetica Ana Paula',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-estetica/estetica-ana-paula.JPG',
      precio: '$500',
    },
    {
      nombre: 'Estetica Avelinas',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-estetica/estetica-avenlinas.jpg',
      precio: '$500',
    },
    {
      nombre: 'Estetica Julia Martinez',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-estetica/estetica-julia-martinez.png',
      precio: '$500'
    }
  ]
}

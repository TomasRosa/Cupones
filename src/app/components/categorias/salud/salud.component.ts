import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salud.component.html',
  styleUrl: './salud.component.css'
})
export class SaludComponent {
  salud: any [] = [
    {
      nombre: 'Farmacia Bufor',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-salud/farmacia-bufor.jpg',
      precio: '$500',
    },
    {
      nombre: 'Farmacia Tandil',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-salud/farmacia-tandil.jpg',
      precio: '$500',
    },
    {
      nombre: 'Farmacia Vera',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-salud/farmacia-vera.jpg',
      precio: '$500'
    }
  ]
}

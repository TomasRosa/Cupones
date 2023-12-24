import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supermercado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supermercado.component.html',
  styleUrl: './supermercado.component.css'
})
export class SupermercadoComponent {
  supermercado: any [] = [
    {
      nombre: 'SuperMercado El Rodo',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-supermercado/supermercado-el-rodo.png',
      precio: '$500',
    },
    {
      nombre: 'SuperMercado Monarca',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-supermercado/supermercado-monarca.jpg',
      precio: '$500',
    },
    {
      nombre: 'SuperMercado Oriente',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-supermercado/supermercado-oriente.jpg',
      precio: '$500'
    }
  ]
}

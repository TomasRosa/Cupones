import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entretenimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entretenimiento.component.html',
  styleUrl: './entretenimiento.component.css'
})
export class EntretenimientoComponent {
  entretenimiento: any [] = [
    {
      nombre: 'Escalada Valle Picapedrero',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-entretenimiento/escalada-valle-picapedrero.jpeg',
      precio: '$500',
    },
    {
      nombre: 'Foot Golf',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-entretenimiento/foot-golf-tandil.jpg',
      precio: '$500',
    }
  ]
}

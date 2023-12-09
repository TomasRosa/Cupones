import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria',
  template: `
  <div *ngFor="let categoria of categorias">
    <button (click)="navegarADetalles(categoria.id)">{{ categoria.nombre }}</button>
  </div>
`,
  standalone: true,
  imports: [],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  categorias = [
    { id: 1, nombre: 'gastronomia' },
    { id: 2, nombre: 'supermercado' },
    { id: 3, nombre:'cine'},
    { id: 3, nombre:'vehiculos'},
    { id: 3, nombre:'teatro'},
    { id: 3, nombre:'salud'},
    { id: 3, nombre:'estetica'},
    { id: 3, nombre:'escapadas'},
    { id: 3, nombre:'entretenimiento'}
  ];

  constructor(private router: Router) {}

  navegarADetalles(categoriaId: number) {
    this.router.navigate(['/detalles-categoria', categoriaId]);
  }
}

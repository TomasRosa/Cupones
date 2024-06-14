import { Component, ViewChild } from '@angular/core';
import { NavigateToService } from '../../services/navigate-to.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../services/share-data.service';
import { Lugar } from '../../interfaces/lugar';
import { VerDetallesService } from '../../services/ver-detalles.service';


@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  imports: [CommonModule],
})
export class InicioComponent {

  imagenes: Lugar[] = [];
  parrafoActual: string = '';
  nombreActual: string = '';
  currentIndex: number = 0;

  constructor(
    private navigateTo: NavigateToService,
    private cdr: ChangeDetectorRef,
    private shareData: ShareDataService,
    private verDetalle: VerDetallesService
  ) 
  {
    this.shareData.getLugares().subscribe((data) =>{
      console.log(data);
      this.imagenes = data;
      this.parrafoActual = this.imagenes[0].descripcion;
      this.nombreActual = this.imagenes[0].nombre;
    })
  }

  @ViewChild('myCarousel') myCarousel!: NgbCarousel;

  public actualizarContenido(event: any) {
    const newIndex = event.to;
    this.currentIndex = newIndex;
    if (newIndex >= 0 && newIndex < this.imagenes.length) {
      this.parrafoActual = this.imagenes[newIndex].descripcion;
      this.nombreActual = this.imagenes[newIndex].nombre;
      this.cdr.markForCheck();
    } else {
      console.error('Índice fuera de rango:', newIndex);
    }
  }
  navigateTos(route: string) {
    this.navigateTo.navigateTo(route);
  }
  verOferta(nombre: string, descripcion: string, precio: number, ruta: string, latitud: number, longitud: number, id: number, nombreCategoria: string, idCategoria: number) {
    const url = `/detalles/${id}`;
    this.verDetalle.setDetallesProducto({ nombre, descripcion, precio, ruta, latitud, longitud, id, nombreCategoria, idCategoria });
    this.navigateTos(url);
  }
  verOfertaCarousel(index: number) {
    if (index >= 0 && index < this.imagenes.length) {
      const cuponEnCarrusel = this.imagenes[index];
      const { nombre, descripcion, precio, ruta, latitud, longitud, id, nombreCategoria, idCategoria } = cuponEnCarrusel;
      const url = `/detalles/${id}`;
      this.verDetalle.setDetallesProducto({ nombre, descripcion, precio, ruta, latitud, longitud, id, nombreCategoria, idCategoria });
      this.navigateTos(url);
    } else {
      console.error('Índice de imagen fuera de rango:', index);
    }
  }
}

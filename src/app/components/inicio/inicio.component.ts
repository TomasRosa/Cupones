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
    const direction = event.direction;
    if (direction === 'left' || direction === 'right') {
      this.currentIndex = this.getNewIndex(direction, event);
      if (
        !isNaN(this.currentIndex) &&
        this.currentIndex >= 0 &&
        this.currentIndex < this.imagenes.length
      ) {
        this.parrafoActual = this.imagenes[this.currentIndex].descripcion;
        this.nombreActual = this.imagenes[this.currentIndex].nombre;
        this.cdr.markForCheck();
      } else {
        console.error(
          'Índice fuera de rango o no es un número válido:',
          this.currentIndex
        );
      }
    }
  }
  private getNewIndex(direction: string, event: any): number {
    const items = this.imagenes.length;

    if (direction === 'right') {
      return this.currentIndex - 1 < 0 ? items - 1 : this.currentIndex - 1;
    } else if (direction === 'left') {
      // Si currentIndex es -1, significa que es la primera vez que cambias a la derecha
      return this.currentIndex === -1
        ? 1
        : this.currentIndex + 1 >= items
        ? 0
        : this.currentIndex + 1;
    }

    return this.currentIndex;
  }
  navigateTos(route: string) {
    this.navigateTo.navigateTo(route);
  }
  verOferta(nombre: string, descripcion: string, precio: string, ruta: string,latitud: number,longitud: number,id: number,nombreCategoria: string,idCategoria: number) {
    
    // Almacenar los detalles del producto en el servicio
    const url = `/detalles/${id}`;
    this.verDetalle.setDetallesProducto({ nombre, descripcion, precio, ruta,latitud,longitud,id,nombreCategoria,idCategoria});
    this.navigateTos(url);
  }
  verOfertaCarousel(index: number) {
    if (index >= 0 && index < this.imagenes.length) {
      const cuponEnCarrusel = this.imagenes[index];
      const { nombre, descripcion, precio, ruta, latitud, longitud,id,nombreCategoria,idCategoria } = cuponEnCarrusel;
      const url = `/detalles/${id}`;
      // Almacenar los detalles del producto en el servicio
      this.verDetalle.setDetallesProducto({ nombre, descripcion, precio, ruta,latitud,longitud,id,nombreCategoria,idCategoria });
      this.navigateTos(url);
    } else {
      console.error('Índice de imagen fuera de rango:', index);
    }
  }  
}

/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { VerDetallesService } from '../../services/ver-detalles.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Lugar } from '../../interfaces/lugar';

@Component({
  selector: 'app-detalles',
  standalone: true,
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css'],
  imports: [CommonModule]
})
export class DetallesComponent implements OnInit {
  detallesProducto: any;
  // @ts-ignore
  map: google.maps.Map; 
  marker: google.maps.Marker | null = null; 

  constructor(private verDetallesService: VerDetallesService,
  private auth: AuthService
  ) { }

  ngOnInit(): void {
    // Suscribirse al observable para obtener los detalles del producto
    this.verDetallesService.detallesProducto$.subscribe(detalles => {
      this.detallesProducto = detalles;
      console.log(this.detallesProducto);
    });
  }
  
  ngAfterViewInit(): void {
    if (this.detallesProducto) {
      this.initMap();
    }
  }
  obtenerCupon(): void {
    if (this.detallesProducto) {
      // Verifica que todas las propiedades necesarias estén definidas
      console.log(this.detallesProducto)
      if (
        this.detallesProducto.id &&
        this.detallesProducto.nombre &&
        this.detallesProducto.descripcion &&
        this.detallesProducto.latitud &&
        this.detallesProducto.longitud &&
        this.detallesProducto.ruta &&
        this.detallesProducto.precio &&
        this.detallesProducto.nombreCategoria &&
        this.detallesProducto.idCategoria 
      ) 
      {
        // Obtener la fecha actual
        const fechaActual = new Date();
        // Obtener el timestamp de la fecha actual en segundos
        const timestamp = Math.floor(fechaActual.getTime() / 1000);
        
        // Crea el objeto Lugar con los detalles del producto actual y el timestamp
        const cupon: Lugar = {
          id: this.detallesProducto.id,
          nombre: this.detallesProducto.nombre,
          descripcion: this.detallesProducto.descripcion,
          latitud: this.detallesProducto.latitud,
          longitud: this.detallesProducto.longitud,
          ruta: this.detallesProducto.ruta,
          precio: this.detallesProducto.precio,
          nombreCategoria: this.detallesProducto.nombreCategoria,
          idCategoria: this.detallesProducto.idCategoria,
          fechaObtenido: fechaActual // Pasar la fecha actual como fechaObtenido
        }
       
        this.auth.addCouponToUser(cupon)
          .then(() => {
            console.log("Cupón agregado al usuario correctamente.");
          })
          .catch(error => {
            console.error("Error al agregar el cupón al usuario:", error);
          });
      } 
      else 
      {
        console.error("Alguna propiedad de detallesProducto es undefined.");
      }
    }
  }
  
  initMap(): void {
    const mapElement = document.getElementById('map');
    this.map = new google.maps.Map(mapElement!, {
      center: { lat: parseFloat(this.detallesProducto.latitud), lng: parseFloat(this.detallesProducto.longitud) },
      zoom: 15
    });
    
    // Colocar un marcador en las coordenadas especificadas
    this.marker = new google.maps.Marker({
      position: { lat: parseFloat(this.detallesProducto.latitud), lng: parseFloat(this.detallesProducto.longitud) },
      map: this.map,
      title: this.detallesProducto.nombre
    });
  }

  
}
/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { VerDetallesService } from '../../services/ver-detalles.service';
import { CommonModule } from '@angular/common';

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

  constructor(private verDetallesService: VerDetallesService) { }

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
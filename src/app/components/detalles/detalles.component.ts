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

  constructor(private verDetallesService: VerDetallesService) { }

  ngOnInit(): void {
    // Suscribirse al observable para obtener los detalles del producto
    this.verDetallesService.detallesProducto$.subscribe(detalles => {
      this.detallesProducto = detalles;
      if (this.detallesProducto) {
        this.initMap();
      }
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
      center: { lat: this.detallesProducto.latitud, lng: this.detallesProducto.longitud },
      zoom: 15
    });
    // Colocar un marcador en las coordenadas especificadas
    new google.maps.Marker({
      map: this.map,
      position: { lat: this.detallesProducto.latitud, lng: this.detallesProducto.longitud }
    });
  }
}
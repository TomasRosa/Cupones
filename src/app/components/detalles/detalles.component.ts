import { Component, OnInit } from '@angular/core';
import { VerDetallesService } from '../../services/ver-detalles.service';
import { CommonModule } from '@angular/common';
import { GeocoderResult, GeocoderStatus } from 'googlemaps';

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
      console.log(this.detallesProducto);
    });
  }
  
  ngAfterViewInit(): void {
    if (this.detallesProducto) {
      this.initMap();
    }
  }

  initMap(): void {
    
    const geocoder = new google.maps.Geocoder();
    const mapElement = document.getElementById('map');
    
    this.map = new google.maps.Map(mapElement!, {
      center: { lat: 0, lng: 0 }, // Centro inicial del mapa
      zoom: 15 // Zoom inicial del mapa
    });

    // Geocodificar la dirección y centrar el mapa en esa ubicación
    geocoder.geocode({ address: this.detallesProducto.direccion }, (results: GeocoderResult[], status: GeocoderStatus) => {
      if (status === 'OK' && results[0]) {
        this.map.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location
        });
      } else {
        console.error('Geocodificación fallida:', status);
      }
    });
  }
}
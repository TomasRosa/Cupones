import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';
import { VerDetallesService } from '../../../services/ver-detalles.service';
import { NavigateToService } from '../../../services/navigate-to.service';

@Component({
  selector: 'app-gastronomia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gastronomia.component.html',
  styleUrl: './gastronomia.component.css'
})
export class GastronomiaComponent {
  gastronomia: any [] = [];

  constructor(private shareData: ShareDataService,
  private verDetalle: VerDetallesService,
  private navigateTo: NavigateToService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunIdCategoria(5).subscribe((data) =>{
      this.gastronomia = data;
    })
  }
  verOferta(id: number, nombre: string, descripcion: string, precio: string, ruta: string, latitud: number, longitud: number) {
    // Almacenar los detalles del producto en el servicio
    this.verDetalle.setDetallesProducto({ nombre, descripcion, precio, ruta,latitud,longitud});
    this.navigateTo.navigateTo('/detalles/' + id);
  }
}
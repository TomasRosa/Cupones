import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';
import { VerDetallesService } from '../../../services/ver-detalles.service';
import { NavigateToService } from '../../../services/navigate-to.service';

@Component({
  selector: 'app-entretenimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entretenimiento.component.html',
  styleUrl: './entretenimiento.component.css'
})
export class EntretenimientoComponent {
  entretenimiento: any [] = [];

  constructor(private shareData: ShareDataService,
  private verDetalle: VerDetallesService,
  private navigateTo: NavigateToService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunIdCategoria(2).subscribe((data) =>{
      this.entretenimiento = data;
    })
  }
  verOferta(id: number, nombre: string, descripcion: string, precio: string, ruta: string, latitud: number, longitud: number, idCategoria: number,nombreCategoria: string) {
    // Almacenar los detalles del producto en el servicio
    this.verDetalle.setDetallesProducto({ id, nombre, descripcion, precio, ruta,latitud,longitud,idCategoria,nombreCategoria});
    this.navigateTo.navigateTo('/detalles/' + id);
  }
}

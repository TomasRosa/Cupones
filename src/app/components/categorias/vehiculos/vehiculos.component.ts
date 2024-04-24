import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';
import { VerDetallesService } from '../../../services/ver-detalles.service';
import { NavigateToService } from '../../../services/navigate-to.service';


@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.css'
})
export class VehiculosComponent {
  vehiculos: any [] = [];

  constructor(private shareData: ShareDataService,
  private verDetalle: VerDetallesService,
  private navigateTo: NavigateToService
  )
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunIdCategoria(9).subscribe((data) =>{
      this.vehiculos = data;
    })
  }
  verOferta(id: number, nombre: string, descripcion: string, precio: string, ruta: string,latitud: number,longitud: number,idCategoria:number,nombreCategoria: string) {
    // Almacenar los detalles del producto en el servicio
    this.verDetalle.setDetallesProducto({ id,nombre, descripcion, precio, ruta,latitud,longitud,idCategoria,nombreCategoria});
    this.navigateTo.navigateTo('/detalles/' + id);
  }
}
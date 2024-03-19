import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';
import { VerDetallesService } from '../../../services/ver-detalles.service';
import { NavigateToService } from '../../../services/navigate-to.service';

@Component({
  selector: 'app-estetica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estetica.component.html',
  styleUrl: './estetica.component.css'
})
export class EsteticaComponent {
  estetica: any [] = [];

  constructor(private shareData: ShareDataService,
  private verDetalle: VerDetallesService,
  private navigateTos: NavigateToService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunIdCategoria(4).subscribe((data) =>{
      this.estetica = data;
    })
  }
  verOferta(nombre: string, descripcion: string, precio: string, ruta: string) {
    // Almacenar los detalles del producto en el servicio
    this.verDetalle.setDetallesProducto({ nombre, descripcion, precio, ruta });
    this.navigateTos.navigateTo('/detalles');
  }
}

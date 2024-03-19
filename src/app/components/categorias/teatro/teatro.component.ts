import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';
import { VerDetallesService } from '../../../services/ver-detalles.service';
import { NavigateToService } from '../../../services/navigate-to.service';

@Component({
  selector: 'app-teatro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teatro.component.html',
  styleUrl: './teatro.component.css'
})
export class TeatroComponent {
  teatro: any [] = [];

  constructor(private shareData: ShareDataService,
  private verDetalle: VerDetallesService,
  private navigateTos: NavigateToService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunIdCategoria(8).subscribe((data) =>{
      this.teatro = data;
    })
  }
  verOferta(nombre: string, descripcion: string, precio: string, ruta: string) {
    // Almacenar los detalles del producto en el servicio
    this.verDetalle.setDetallesProducto({ nombre, descripcion, precio, ruta });
    this.navigateTos.navigateTo('/detalles');
  }
}

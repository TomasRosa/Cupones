import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';
import { VerDetallesService } from '../../../services/ver-detalles.service';
import { NavigateToService } from '../../../services/navigate-to.service';

@Component({
  selector: 'app-supermercado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supermercado.component.html',
  styleUrl: './supermercado.component.css'
})
export class SupermercadoComponent {
  supermercado: any [] = [];

  constructor(private shareData: ShareDataService,
  private verDetalle: VerDetallesService,
  private navigateTos: NavigateToService
  )
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunIdCategoria(7).subscribe((data) =>{
      this.supermercado = data;
    })
  }
  verOferta(nombre: string, descripcion: string, precio: string, ruta: string) {
    // Almacenar los detalles del producto en el servicio
    this.verDetalle.setDetallesProducto({ nombre, descripcion, precio, ruta });
    this.navigateTos.navigateTo('/detalles');
  }
}

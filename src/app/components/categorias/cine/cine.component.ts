import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';
import { VerDetallesService } from '../../../services/ver-detalles.service';
import { NavigateToService } from '../../../services/navigate-to.service';

@Component({
  selector: 'app-cine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cine.component.html',
  styleUrl: './cine.component.css'
})
export class CineComponent {
  cine: any[] = [];

  constructor(private shareData: ShareDataService,
    private verDetalle: VerDetallesService,
    private navigateTo: NavigateToService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunIdCategoria(1).subscribe((data) =>{
      console.log(data);
      if (Array.isArray(data)) {
        this.cine = data;
      } else {
        this.cine = [data]; // Envolver el objeto en un array
      }
    })
  }
  verOferta(id: number, nombre: string, descripcion: string, precio: string, ruta: string) {
    // Almacenar los detalles del producto en el servicio
    this.verDetalle.setDetallesProducto({ nombre, descripcion, precio, ruta});
    this.navigateTo.navigateTo('/detalles/' + id);
  }
}

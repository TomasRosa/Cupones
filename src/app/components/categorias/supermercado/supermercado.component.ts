import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';

@Component({
  selector: 'app-supermercado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supermercado.component.html',
  styleUrl: './supermercado.component.css'
})
export class SupermercadoComponent {
  supermercado: any [] = [];

  constructor(private shareData: ShareDataService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunId(7).subscribe((data) =>{
      this.supermercado = data;
    })
  }
}

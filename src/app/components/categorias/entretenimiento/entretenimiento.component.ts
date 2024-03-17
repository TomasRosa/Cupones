import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';

@Component({
  selector: 'app-entretenimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entretenimiento.component.html',
  styleUrl: './entretenimiento.component.css'
})
export class EntretenimientoComponent {
  entretenimiento: any [] = [];

  constructor(private shareData: ShareDataService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunId(2).subscribe((data) =>{
      this.entretenimiento = data;
    })
  }
}

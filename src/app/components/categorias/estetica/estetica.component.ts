import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';

@Component({
  selector: 'app-estetica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estetica.component.html',
  styleUrl: './estetica.component.css'
})
export class EsteticaComponent {
  estetica: any [] = [];

  constructor(private shareData: ShareDataService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunId(4).subscribe((data) =>{
      this.estetica = data;
    })
  }
}

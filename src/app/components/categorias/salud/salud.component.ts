import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';

@Component({
  selector: 'app-salud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salud.component.html',
  styleUrl: './salud.component.css'
})
export class SaludComponent {
  salud: any [] = [];

  constructor(private shareData: ShareDataService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunId(6).subscribe((data) =>{
      this.salud = data;
    })
  }
}

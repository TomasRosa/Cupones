import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';

@Component({
  selector: 'app-escapadas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './escapadas.component.html',
  styleUrl: './escapadas.component.css'
})
export class EscapadasComponent {
  escapadas: any [] = [];

  constructor(private shareData: ShareDataService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunId(3).subscribe((data) =>{
      this.escapadas = data;
    })
  }
}

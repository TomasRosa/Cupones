import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDataService } from '../../../services/share-data.service';

@Component({
  selector: 'app-teatro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teatro.component.html',
  styleUrl: './teatro.component.css'
})
export class TeatroComponent {
  teatro: any [] = [];

  constructor(private shareData: ShareDataService)
  {
    // Llamar al método obtenerDatosSegunId con el ID 1
    this.shareData.obtenerDatosSegunId(8).subscribe((data) =>{
      this.teatro = data;
    })
  }
}

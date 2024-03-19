import { Component } from '@angular/core';
import { NavigateToService } from '../../services/navigate-to.service';
import { PopupService } from '../../services/pop-up-service.service';
import { PopupComponent } from "../popup/popup.component";
import { Lugar } from '../../interfaces/lugar';
import { ShareDataService } from '../../services/share-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerDetallesService } from '../../services/ver-detalles.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    imports: [PopupComponent,CommonModule,FormsModule]
})
export class NavbarComponent {
  constructor(private navigateTo: NavigateToService, 
    private popUpService: PopupService, 
    private shareData: ShareDataService,
    private verDetalle: VerDetallesService) {}
  
  terminoBusqueda: string = '';
  resultadosBusqueda: Lugar[] = [];

  filtrarLugares() {
    if (this.terminoBusqueda.trim() !== '') {
      this.shareData.filtrarPorLugares(this.terminoBusqueda).subscribe((data) => {
        this.resultadosBusqueda = data;
      });
    } else {
      this.resultadosBusqueda = [];
    }
  }
  verDetalles(id: number) {
    const detalles = this.resultadosBusqueda.find(lugar => lugar.id === id);
    if (detalles) {
        this.verDetalle.setDetallesProducto(detalles); // Enviamos los detalles al servicio
        this.navigateToDetalles(id);
    }
}
  navigateToDetalles(id: number) {
    // Aquí navegas al componente de detalles con los detalles del producto
    this.navigateTos('/detalles/' + id);
    this.resultadosBusqueda = [];
    this.terminoBusqueda = '';
  }
  
  navigateTos(route: string) {
    this.navigateTo.navigateTo(route);
  }
  openPopup()
  {
    console.log('Abrinendo PopUp...');
    this.popUpService.open();
  }
}

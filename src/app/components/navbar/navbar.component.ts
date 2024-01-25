import { Component } from '@angular/core';
import { NavigateToService } from '../../services/navigate-to.service';
import { PopupService } from '../../services/pop-up-service.service';
import { PopupComponent } from "../popup/popup.component";

@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    imports: [PopupComponent]
})
export class NavbarComponent {
  constructor(private navigateTo: NavigateToService, private popUpService: PopupService) {}

  navigateTos(route: string) {
    this.navigateTo.navigateTo(route);
  }
  openPopup()
  {
    console.log('Abrinendo PopUp...');
    this.popUpService.open();
  }
}

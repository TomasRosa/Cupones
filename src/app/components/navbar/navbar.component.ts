import { Component } from '@angular/core';
import { NavigateToService } from '../../services/navigate-to.service';

@Component({
  selector: 'app-navbar',
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private navigateTo: NavigateToService) {}

  navigateTos(route: string) {
    this.navigateTo.navigateTo(route);
  }
}

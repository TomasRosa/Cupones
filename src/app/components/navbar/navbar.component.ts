import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router) {}

  navigateTo(route: string, categoriaId?: number) {
    if (categoriaId !== undefined) {
      this.router.navigate([`/detalles-categoria/${categoriaId}`]);
    } else {
      this.router.navigate([`/${route}`]);
    }
  }
}

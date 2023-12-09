import { Component } from '@angular/core';
import { CategoriaComponent } from '../categoria/categoria.component';
import {Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CategoriaComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private route: Router) {}
  navigateTo(route: string) {
    this.route.navigate([`/${route}`]);
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigateToService {

  constructor(private router: Router) { }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}

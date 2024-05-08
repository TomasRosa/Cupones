import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true; // Si el usuario está autenticado, permite el acceso a la ruta
        } else {
          this.router.navigate(['/no-auth']); // Si el usuario no está autenticado, redirige a la página de inicio de sesión
          return false; // No permite el acceso a la ruta
        }
      })
    );
  }
}

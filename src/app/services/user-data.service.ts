import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private nombreUsuarioSource = new BehaviorSubject<string | null>(null);
  nombreUsuario$ = this.nombreUsuarioSource.asObservable();

  setNombreUsuario(nombre: string | null) {
    this.nombreUsuarioSource.next(nombre);
  }
}
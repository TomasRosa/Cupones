import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedMisDatosService {
  
  private nombreSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  nombreUsuario$: Observable<string | null> = this.nombreSubject.asObservable();

  setNombreUsuario(nombreUsuario: string | null) {
    this.nombreSubject.next(nombreUsuario);
  }
}

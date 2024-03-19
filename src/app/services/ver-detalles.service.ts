import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerDetallesService {
  private detallesProducto = new BehaviorSubject<any>(null);
  detallesProducto$ = this.detallesProducto.asObservable();
  
  constructor() { }
  
  setDetallesProducto(detalles: any) {
    this.detallesProducto.next(detalles);
  }
}

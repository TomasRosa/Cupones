import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Lugar } from '../interfaces/lugar';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  
  URL = environment.urlApi;
  
  constructor(private http: HttpClient) {}
  
  obtenerDatosSegunIdCategoria(idCategoria: number): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.URL}/lugares/categorias/${idCategoria}`);
  }
  obtenerDatosSegunId(idFront: number): Observable<Lugar>
  {
    return this.http.get<Lugar>(`${this.URL}/lugares/${idFront}`)
  }
  
  filtrarPorLugares(consulta: string): Observable<Lugar[]> {
    return this.getLugares().pipe(
      map((lugares: any[]) => lugares.filter(lugar =>
        lugar.nombre.toLowerCase().includes(consulta.toLowerCase()) ||
        lugar.nombreCategoria.toLowerCase().includes(consulta.toLowerCase())
      ))
    );
  }
  getLugares(): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.URL}/lugares`);
  }
}

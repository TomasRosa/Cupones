import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lugar } from '../interfaces/lugar';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  
  URL = environment.urlApi;

  constructor(private http: HttpClient) {}
  
//   obtenerDatosSegunId(idCategoria: number): any[] {
//     return this.lugares.filter((lugar) => lugar.idCategoria === idCategoria);
//   }
//   filtrarPorLugares(consulta: string): any {
//     return this.lugares.filter(lugar =>
//         lugar.nombre.toLowerCase().includes(consulta.toLowerCase()) || // Buscar por nombre del lugar
//         lugar.nombreCategoria.toLowerCase().includes(consulta.toLowerCase()) // Buscar por nombre de categoría
//     );
// }
 getLugares(): Observable<Lugar[]>
 {
    return this.http.get<Lugar[]>(`${this.URL}/lugares`);
 }

}
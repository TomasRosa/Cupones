export interface Lugar {
  id: number;
  ruta: string;
  descripcion: string;
  nombre: string;
  precio: string;
  nombreCategoria: string;
  idCategoria: number;
  latitud: number;
  longitud: number;
  createdAt: Date; // Asegúrate de que el tipo sea adecuado para la fecha, posiblemente Date
  updatedAt: Date; // Asegúrate de que el tipo sea adecuado para la fecha, posiblemente Date
}

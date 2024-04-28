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
  fechaObtenido?: Date; // Mantenido como Date
}
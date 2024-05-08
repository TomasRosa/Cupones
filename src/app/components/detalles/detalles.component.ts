/// <reference types="@types/googlemaps" />
import { Component, OnInit } from "@angular/core";
import { VerDetallesService } from "../../services/ver-detalles.service";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { Lugar } from "../../interfaces/lugar";
import { ShareDataService } from "../../services/share-data.service";
import { NavigateToService } from "../../services/navigate-to.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-detalles",
  standalone: true,
  templateUrl: "./detalles.component.html",
  styleUrls: ["./detalles.component.css"],
  imports: [CommonModule],
})
export class DetallesComponent implements OnInit {
  detallesProducto: any = {};
  // @ts-ignore
  map: google.maps.Map | null;
  marker: google.maps.Marker | null = null;
  lugaresSimilares: Lugar[] = [];
  mensajeObtenerCupon: string = "";

  constructor(
    private verDetallesService: VerDetallesService,
    private auth: AuthService,
    private share: ShareDataService,
    private navigateTo: NavigateToService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const productId = params["id"];

      // Obtener detalles del producto y lugares similares
      this.obtenerDetallesYLugares(productId);
    });
  }
  obtenerDetallesYLugares(productId: number): void {
    this.share.obtenerDatosSegunId(productId).subscribe(
      (detalles) => {
        this.detallesProducto = detalles;
        // Actualizar los detalles del producto en el servicio
        this.verDetallesService.setDetallesProducto(detalles);
        
        // Inicializar el mapa una vez que se obtengan los detalles
        this.initMap();

        // Obtener lugares similares después de obtener los detalles
        this.obtenerLugaresSimilares(
          this.detallesProducto.idCategoria,
          productId
        );
      },
      (error) => {
        console.error("Error al obtener detalles del producto:", error);
        // Manejar el error aquí si es necesario
      }
    );
  }
  ngAfterViewInit(): void {
    if (this.detallesProducto) {
      this.initMap();
    }
  }
  obtenerLugaresSimilares(categoriaActual: number, idActual: number): void {
    // Obtener los lugares similares del servicio ShareDataService
    this.share
      .obtenerDatosSegunIdCategoria(categoriaActual)
      .subscribe((lugares) => {
        // Filtrar el lugar actual de los lugares similares
        this.lugaresSimilares = lugares.filter(
          (lugar) => lugar.id !== idActual
        );
      });
  }
  verOferta(id: number) {
    // Obtener los detalles del producto por su ID
    const productoSeleccionado = this.lugaresSimilares.find(
      (lugar) => lugar.id === id
    );
    // Verificar si se encontraron los detalles del producto
    if (productoSeleccionado) {
      // Almacenar los detalles del producto en el servicio
      this.verDetallesService.setDetallesProducto(productoSeleccionado);
      // Construir la URL del nuevo lugar
      const url = `/detalles/${id}`;
      // Redirigir al usuario a la nueva URL
      this.navigateTo.navigateTo(url);
    } else {
      console.error("No se encontraron los detalles del producto.");
    }
  }
  obtenerCupon(): void {
    if (this.detallesProducto) {
      // Verifica que todas las propiedades necesarias estén definidas
      if (
        this.detallesProducto.id &&
        this.detallesProducto.nombre &&
        this.detallesProducto.descripcion &&
        this.detallesProducto.latitud &&
        this.detallesProducto.longitud &&
        this.detallesProducto.ruta &&
        this.detallesProducto.precio &&
        this.detallesProducto.nombreCategoria &&
        this.detallesProducto.idCategoria
      ) {
        // Obtener la fecha actual
        const fechaActual = new Date();

        // Crea el objeto Lugar con los detalles del producto actual y el timestamp
        const cupon: Lugar = {
          id: this.detallesProducto.id,
          nombre: this.detallesProducto.nombre,
          descripcion: this.detallesProducto.descripcion,
          latitud: this.detallesProducto.latitud,
          longitud: this.detallesProducto.longitud,
          ruta: this.detallesProducto.ruta,
          precio: this.detallesProducto.precio,
          nombreCategoria: this.detallesProducto.nombreCategoria,
          idCategoria: this.detallesProducto.idCategoria,
          fechaObtenido: fechaActual, // Pasar la fecha actual como fechaObtenido
        };
        this.auth
          .addCouponToUser(cupon)
          .then(() => {
            this.mensajeObtenerCupon = "Cupon obtenido correctamente!";
            this.hideMessageAfterDelay(2000);
          })
          .catch((error) => {
            this.mensajeObtenerCupon =
              "Debes iniciar sesión para realizar esta acción.";
            console.error("Error al agregar el cupón al usuario:", error);
            this.hideMessageAfterDelay(2000);
          });
      } else {
        console.error("Alguna propiedad de detallesProducto es undefined.");
      }
    }
  }
  initMap(): void {
    // Eliminar el mapa existente si lo hay
    if (this.map) {
      this.map = null;
    }
    // Crear el nuevo mapa si hay detalles del producto disponibles
    if (this.detallesProducto) {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        this.map = new google.maps.Map(mapElement, {
          center: {
            lat: parseFloat(this.detallesProducto.latitud),
            lng: parseFloat(this.detallesProducto.longitud),
          },
          zoom: 15,
        });
        this.marker = new google.maps.Marker({
          position: {
            lat: parseFloat(this.detallesProducto.latitud),
            lng: parseFloat(this.detallesProducto.longitud),
          },
          map: this.map,
          title: this.detallesProducto.nombre,
        });
      }
    }
  }
  hideMessageAfterDelay(delay: number) {
    setTimeout(() => {
      this.mensajeObtenerCupon = "";
    }, delay);
  }
}

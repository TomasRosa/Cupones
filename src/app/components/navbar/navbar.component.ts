import { Component, OnInit } from "@angular/core";
import { NavigateToService } from "../../services/navigate-to.service";
import { PopupService } from "../../services/pop-up-service.service";
import { PopupComponent } from "../popup/popup.component";
import { Lugar } from "../../interfaces/lugar";
import { ShareDataService } from "../../services/share-data.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { VerDetallesService } from "../../services/ver-detalles.service";
import { AuthService } from "../../services/auth.service";
import { Observable, switchMap, take, of} from "rxjs";


@Component({
  selector: "app-navbar",
  standalone: true,
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
  imports: [PopupComponent, CommonModule, FormsModule],
})
export class NavbarComponent implements OnInit {
  constructor(
    private navigateTo: NavigateToService,
    private popUpService: PopupService,
    private shareData: ShareDataService,
    private verDetalle: VerDetallesService,
    private auth: AuthService,
  ) {}

  terminoBusqueda: string = "";
  resultadosBusqueda: Lugar[] = [];
  mensajeLogout: string = "";

  isUserLoggedIn$!: Observable<boolean>;

  isMenuOpen: boolean = false;

  apellidoUsuario$!: Observable<string | null>;
  nombreUsuario$: Observable<string | null> | null = null;
  emailUsuario$: Observable<string | null> | null = null;
  cantTickets$: Observable<number | null> | null = null;

  ngOnInit(): void {
    this.isUserLoggedIn$ = this.auth.isLoggedIn();

    this.isUserLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          console.log("El usuario está logueado");
          return this.auth.getName().pipe(take(1));
        } else {
          console.log("El usuario no está logueado");
          return of(null);
        }
      })
    ).subscribe(name => {
      this.nombreUsuario$ = of(name);
    });

    this.isUserLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.auth.getEmail().pipe(take(1));
        } else {
          return of(null);
        }
      })
    ).subscribe(email => {
      this.emailUsuario$ = of(email);
    });

    this.isUserLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if(isLoggedIn)
        {
          return this.auth.getCantTickets().pipe(take(1));
        }
        else
        {
          return of(null);
        }
      })
    ).subscribe(cantTickets => {
      this.cantTickets$ = of(cantTickets);
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.auth.isLoggedIn();
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  openPopup() {
    this.popUpService.open();
  }
  filtrarLugares() {
    if (this.terminoBusqueda.trim() !== "") {
      this.shareData
        .filtrarPorLugares(this.terminoBusqueda)
        .subscribe((data) => {
          this.resultadosBusqueda = data;
        });
    } else {
      this.resultadosBusqueda = [];
    }
  }
  verDetalles(id: number) {
    const detalles = this.resultadosBusqueda.find((lugar) => lugar.id === id);
    if (detalles) {
      this.verDetalle.setDetallesProducto(detalles); // Enviamos los detalles al servicio
      this.navigateToDetalles(id);
    }
  }
  navigateToDetalles(id: number) {
    // Aquí navegas al componente de detalles con los detalles del producto
    this.navigateTo.navigateTo("/detalles/" + id);
    this.resultadosBusqueda = [];
    this.terminoBusqueda = "";
  }
  navigateTos(route: string) {
    this.navigateTo.navigateTo(route);
  }
  logout() {
    this.auth.logout().then((response) => {
      console.log(response);
      this.mensajeLogout = "¡Hasta luego!";
      setTimeout(() => {
        this.mensajeLogout = '';
        this.navigateTo.navigateTo("/inicio");
      }, 1500);
    });
  }
}

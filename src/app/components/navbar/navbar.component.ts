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
import { SharedTicketService } from "../../services/shared-ticket.service";
import { SharedMisDatosService } from "../../services/shared-mis-datos.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { WheelComponent } from "../wheel/wheel.component";
import * as bootstrap from 'bootstrap';

@Component({
  selector: "app-navbar",
  standalone: true,
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
  imports: [PopupComponent, CommonModule, FormsModule,WheelComponent],
})
export class NavbarComponent implements OnInit {
  constructor(
    private navigateTo: NavigateToService,
    private popUpService: PopupService,
    private shareData: ShareDataService,
    private verDetalle: VerDetallesService,
    private auth: AuthService,
    private sharedTicketService: SharedTicketService,
    private sharedMisDatos: SharedMisDatosService,
    private modalService: NgbModal
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
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const offcanvasMenu = document.getElementById('offcanvasMenu');
    if (offcanvasMenu) {
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvasMenu);
      this.isMenuOpen ? bsOffcanvas.show() : bsOffcanvas.hide();
    }
  }
  
  ngOnInit(): void {
    this.isUserLoggedIn$ = this.auth.isLoggedIn();
    console.log(this.isMenuOpen);
    this.nombreUsuario$ = this.sharedMisDatos.nombreUsuario$;

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
      this.sharedMisDatos.setNombreUsuario(name);
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

    this.cantTickets$ = this.sharedTicketService.cantTickets$;

    this.isUserLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.auth.getCantTickets().pipe(take(1));
        } else {
          return of(null);
        }
      })
    ).subscribe(cantTickets => {
      this.sharedTicketService.setCantTickets(cantTickets ?? 0); // Inicializar el cantTickets en el SharedTicketService
    });
  }
  
  openWheel() {
    const modalRef = this.modalService.open(WheelComponent);
  }
  isLoggedIn(): Observable<boolean> {
    return this.auth.isLoggedIn();
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
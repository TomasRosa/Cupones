import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { NavigateToService } from '../../services/navigate-to.service';
import { NgFor, NgIf } from '@angular/common';
import { NgbCarousel, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements AfterViewInit {
  constructor(private navigateTo: NavigateToService) {}
  @ViewChild('myCarousel') myCarousel!: NgbCarousel;

  imagenes: any[] = [
    {
      ruta: './assets/images/images-cine/cinemacenter.jpg',
      parrafo:
        'Descubre la magia del cine en Cinemacenter, tu destino cinematográfico de calidad. Sumérgete en la experiencia única de nuestras modernas salas equipadas con la última tecnología audiovisual. Disfruta de estrenos, clásicos y producciones aclamadas con la comodidad que te mereces. En Cinemacenter, te ofrecemos un ambiente acogedor, asientos cómodos y servicios de primera. Desde emocionantes películas de acción hasta conmovedoras aventuras familiares, encontrarás opciones para todos los gustos. Vive el séptimo arte con proyecciones en alta definición y sonido envolvente. En Cinemacenter, cada función es una oportunidad para crear recuerdos inolvidables. ¡Bienvenido a la experiencia cinematográfica de Cinemacenter!',
      nombre: 'Cinemacenter',
    },
    {
      ruta: './assets/images/images-entretenimiento/foot-golf-tandil.jpg',
      parrafo:
        'El Campo de Footgolf "La Mulita" ofrece una experiencia única en la fusión entre el emocionante mundo del fútbol y la precisión del golf. Situado en un entorno pintoresco, rodeado de exuberante vegetación y vistas impresionantes, nuestro campo ha sido diseñado para desafiar y cautivar a jugadores de todos los niveles.Con 18 hoyos estratégicamente diseñados, cada recorrido presenta desafíos emocionantes que ponen a prueba tu destreza futbolística y habilidades tácticas. Los greens impecablemente cuidados ofrecen un terreno de juego perfecto, mientras que los obstáculos estratégicamente ubicados añaden emoción a cada patada.',
      nombre: 'La Mulita',
    },
    {
      ruta: './assets/images/images-escapadas/hotel-francia.webp',
      parrafo:
        'El Hotel Francia, ubicado en el corazón de la encantadora ciudad, es el destino perfecto para quienes buscan una experiencia única de hospitalidad. Con una fusión de elegancia clásica y comodidades modernas, nuestras habitaciones ofrecen un ambiente acogedor y relajante. Disfruta de la exquisita gastronomía en nuestro restaurante, sumérgete en la serenidad de nuestro spa o celebra eventos especiales en nuestros espacios elegantes. Ya sea por negocios o placer, el Hotel Francia se compromete a brindarte una estancia inolvidable en cada momento.',
      nombre: 'Hotel Francia',
    },
    {
      ruta: './assets/images/images-estetica/estetica-avelinas.jpg',
      parrafo:
        'Avelinas, tu refugio de bienestar y belleza. En nuestro centro de estética, nos dedicamos a realzar tu luminosidad interior y exterior. Experimenta tratamientos rejuvenecedores diseñados para nutrir tu piel y renovar tu vitalidad. Nuestro equipo de profesionales apasionados te guiará en un viaje de cuidado personalizado, desde faciales revitalizantes hasta terapias corporales relajantes. En un ambiente sereno y acogedor, Avelinas se compromete a brindarte una experiencia única donde te desconectarás del estrés diario y te conectarás contigo mismo. Descubre el equilibrio perfecto entre relajación y transformación en Avelinas, donde la belleza se encuentra con la armonía interior.',
      nombre: 'Avelinas',
    },
    {
      ruta: './assets/images/images-gastronomia/el-molino-tandil.jpg',
      parrafo:
        'Bienvenido a El Molino, un rincón gastronómico donde los sabores auténticos se encuentran con la tradición. Sumérgete en una experiencia culinaria única, donde cada plato es una obra maestra de frescura y creatividad. Con un ambiente encantador y atención personalizada, te invitamos a disfrutar de nuestra cocina exquisita que fusiona lo contemporáneo con lo clásico. Desde ingredientes cuidadosamente seleccionados hasta presentaciones artísticas, cada detalle en El Molino está diseñado para deleitar tus sentidos. Descubre un menú diverso que celebra la riqueza de la gastronomía local e internacional. En El Molino, no solo alimentamos tu cuerpo, sino también tu alma, creando recuerdos gastronómicos que perdurarán en el tiempo.',
      nombre: 'El Molino',
    },
    {
      ruta: './assets/images/images-salud/farmacia-bufor.jpg',
      parrafo:
        'Bienvenido a Bufor, tu destino de confianza para cuidar de tu bienestar. En nuestra farmacia, nos dedicamos a ofrecerte servicios de salud excepcionales y productos de la más alta calidad. Con un equipo de profesionales comprometidos, estamos aquí para brindarte asesoramiento experto y soluciones para tus necesidades de salud. En Bufor, nos enorgullece ser más que una farmacia, somos un recurso integral para tu bienestar, desde medicamentos hasta productos de cuidado personal. Nuestra misión es proporcionar un ambiente amigable y accesible, donde te sientas respaldado en tu búsqueda de una vida saludable. Confía en nosotros para encontrar todo lo que necesitas para tu salud y la de tu familia. En Bufor, tu bienestar es nuestra prioridad',
      nombre: 'Bufor',
    },
    {
      ruta: './assets/images/images-supermercado/supermercado-monarca.jpg',
      parrafo:
        'Bienvenido a Supermercado Monarca, tu destino de compras que combina calidad, variedad y servicio excepcional. En Monarca, nos enorgullece ofrecer una experiencia de compra única, donde la frescura y la diversidad se encuentran en cada pasillo. Nuestro compromiso con productos de alta calidad y precios competitivos asegura que encuentres todo lo que necesitas para abastecer tu hogar. Desde productos frescos y deliciosos comestibles hasta artículos de uso diario, Monarca es tu ventanilla única para todas tus necesidades de supermercado. Nuestro amable personal está aquí para ayudarte, brindándote asesoramiento personalizado y un servicio eficiente. En Supermercado Monarca, no solo nos preocupamos por tu cesta de compras, sino también por tu experiencia general de compra. Ven y descubre la diferencia en Monarca, donde la calidad y la conveniencia se encuentran en cada rincón.',
      nombre: 'Monarca',
    },
    {
      ruta: './assets/images/images-teatro/teatro-bajo-suelo.jpg',
      parrafo:
        'Bienvenido a "Bajo Suelo", tu refugio cultural en el corazón de la ciudad. Sumérgete en la magia del arte escénico en nuestro teatro, donde la creatividad y la pasión se entrelazan para ofrecerte experiencias inolvidables. Con un ambiente íntimo y acogedor, "Bajo Suelo" se erige como un espacio donde las emociones cobran vida a través de actuaciones cautivadoras. Desde obras teatrales impactantes hasta eventos especiales, nuestro escenario es el lienzo de narrativas vibrantes y actuaciones magistrales. Con un compromiso inquebrantable con la excelencia artística, te invitamos a explorar un mundo de historias, risas y reflexiones en "Bajo Suelo". Únete a nosotros para celebrar la diversidad del teatro y sumergirte en un universo de emociones teñido de creatividad y expresión artística. ¡Descubre el encanto único de "Bajo Suelo" y vive la magia del teatro en su máxima expresión!',
      nombre: 'Bajo Suelo',
    },
    {
      ruta: './assets/images/images-vehiculos/motos-consecionaria.JPG',
      parrafo:
        'Explora la libertad sobre dos ruedas en nuestra concesionaria, donde la pasión por las motocicletas se encuentra con la excelencia en servicio. En nuestra amplia sala de exhibición, encontrarás una cuidada selección de las últimas y más emocionantes motos, desde clásicas hasta las más innovadoras. Nuestro equipo apasionado y conocedor está dedicado a ayudarte a encontrar la moto perfecta que se adapte a tu estilo y preferencias. Además de ofrecer vehículos de alta calidad, brindamos servicios de mantenimiento y personalización para asegurarnos de que tu experiencia en la carretera sea impecable. En nuestra concesionaria, no solo vendemos motos, sino que también cultivamos una comunidad de entusiastas que comparten la misma devoción por la aventura y la velocidad. Únete a nosotros y descubre el emocionante mundo de las dos ruedas en nuestra concesionaria de motos, donde la adrenalina y la elegancia convergen en una experiencia única.',
      nombre: 'Motos',
    },
  ];
  parrafoActual: string = this.imagenes[0].parrafo;
  nombreActual: string = this.imagenes[0].nombre;
  activeIndex: number = 0;
  ngAfterViewInit() {
    if (this.myCarousel) {
      this.myCarousel.slide?.subscribe((event: NgbSlideEvent | number | Event) => {
        if (this.esNgbSlideEvent(event)) {
          const indexAsNumber = Number((event as NgbSlideEvent).current);
          this.actualizarContenido();
        }
      });
    }
  }
  
  private esNgbSlideEvent(event: NgbSlideEvent | number | Event): event is NgbSlideEvent {
    return typeof event === 'object' && 'current' in event && 'direction' in event;
  }
  
  public actualizarContenido() 
  {
    console.log('Hi');
    if (this.myCarousel) 
    {
      const index: number = +this.myCarousel.activeId; // Use the '+' operator to convert the string to a number
      this.parrafoActual = this.imagenes[index].parrafo;
      this.nombreActual = this.imagenes[index].nombre;
    }
  }
  
  

  destacados: any[] = [
    {
      nombre: 'Cine Espacio Inca',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-cine/espacio-incaa.jpeg',
      precio: '$500',
    },
    {
      nombre: 'Foot-Golf Tandil',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-entretenimiento/foot-golf-tandil.jpg',
      precio: '$500',
    },
    {
      nombre: 'Estetica Ana Paula',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-estetica/estetica-ana-paula.JPG',
      precio: '$500',
    },
    {
      nombre: 'Restaurante La Cuadra',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-gastronomia/la-cuadra-tandil.jpg',
      precio: '$500',
    },
    {
      nombre: 'Concesionaria San Jorge',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-vehiculos/san-jorge-consecionarias.jpg',
      precio: '$500',
    },
    {
      nombre: 'Hotel Nuevos Horizontes',
      descripcion: 'Lorem ipsum, dolor sit amet consectetur',
      imagen: 'assets/images/images-escapadas/hotel-nuevos-horizontes.webp',
      precio: '$500',
    },
  ];

  navigateTos(route: string) {
    this.navigateTo.navigateTo(route);
  }
}

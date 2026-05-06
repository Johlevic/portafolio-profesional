import { Injectable, signal, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

export type Language = 'es' | 'en';

export interface Translations {
  [key: string]: string | Translations;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private titleService = inject(Title);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute, { optional: true });

  // Signal para el idioma actual
  currentLanguage = signal<Language>(this.getInitialLanguage());

  // Signal para la key del título actual
  currentTitleKey = signal<string>('nav.home');

  // Traducciones cargadas
  private translations = signal<Record<Language, Translations>>({
    es: {},
    en: {},
  });

  constructor() {
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute ?? this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        const key = route.snapshot.data['titleKey'];
        if (key) {
          this.currentTitleKey.set(key);
        }
      });

    // Effect para aplicar el idioma cuando cambie
    effect(() => {
      const lang = this.currentLanguage();
      this.saveLanguage(lang);
      // Actualizar el atributo lang del HTML
      document.documentElement.lang = lang;

      // Actualizar titulo de la pagina
      const siteTitle = this.translate('meta.title');
      const pageKey = this.currentTitleKey();

      // Asegurarse de rastrear dependencies
      const pageTitle = this.translate(pageKey);

      if (siteTitle !== 'meta.title') {
        if (pageTitle && pageTitle !== pageKey && pageKey !== 'nav.home') {
          this.titleService.setTitle(`${pageTitle} | ${siteTitle}`);
        } else {
          this.titleService.setTitle(siteTitle);
        }
      }
    });

    // Cargar traducciones
    this.loadTranslations();
  }

  /**
   * Obtiene el idioma inicial desde localStorage o navegador
   */
  private getInitialLanguage(): Language {
    // Primero intentar obtener de localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'es' || savedLang === 'en') {
      return savedLang;
    }

    // Si no hay idioma guardado, detectar del navegador
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) {
      return 'es';
    }

    return 'es'; // Por defecto español
  }

  /**
   * Guarda el idioma en localStorage
   */
  private saveLanguage(lang: Language): void {
    localStorage.setItem('language', lang);
  }

  /**
   * Alterna entre español e inglés
   */
  toggleLanguage(): void {
    this.currentLanguage.update((current) => (current === 'es' ? 'en' : 'es'));
  }

  /**
   * Establece un idioma específico
   */
  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
  }

  /**
   * Obtiene una traducción por clave
   */
  translate(key: string): string {
    const lang = this.currentLanguage();
    const translations = this.translations()[lang];

    // Navegar por la clave usando dot notation (ej: "nav.home")
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Si no encuentra la traducción, devuelve la clave
      }
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Alias corto para translate
   */
  t(key: string): string {
    return this.translate(key);
  }

  /**
   * Carga las traducciones (por ahora inline, luego pueden ser archivos JSON)
   */
  private loadTranslations(): void {
    this.translations.set({
      es: {
        meta: {
          title: 'Portafolio de Jhony Lezama',
        },
        nav: {
          home: 'Inicio',
          about: 'Sobre Mí',
          skills: 'Habilidades',
          projects: 'Proyectos',
          experience: 'Experiencia',
          contact: 'Contacto',
          quickLinks: 'Enlaces Rápidos',
          socialMedia: 'Redes Profesionales',
        },
        header: {
          role: 'Developer',
        },
        sidebar: {
          role: 'Ingeniero de Software',
        },
        mobile: {
          role: 'Desarrollador Full Stack',
          findMe: 'Encuéntrame en',
        },
        about: {
          technologiesTitle: 'Tecnologías',
          techCarouselPrev: 'Tecnologías anteriores',
          techCarouselNext: 'Siguientes tecnologías',
          mastered: 'Masterizadas',
          title: 'Sobre Mí',
          description:
            'Un vistazo a mi trayectoria, formación profesional y lo que me motiva a crear tecnología.',
        },
        skills: {
          title: 'Habilidades Técnicas',
          description:
            'Ecosistema de tecnologías y herramientas que utilizo para materializar ideas en soluciones digitales.',
          frontend: 'Frontend',
          backend: 'Backend',
          database: 'Base de Datos',
          devops: 'DevOps & Cloud',
          desktop: 'Escritorio & nativo',
          mobile: 'Móvil',
          ai: 'IA y RA',
          data_analyst: 'Analista de Datos',
        },
        projects: {
          title: 'Proyectos Destacados',
          subtitle:
            'Algunos de los proyectos más interesantes en los que he trabajado',
          viewMore: 'Ver más',
          viewLess: 'Ver menos',
          searchPlaceholder: 'Buscar…',
          sortLabel: 'Orden',
          sortDefault: 'Destacados',
          sortAz: 'A–Z',
          sortZa: 'Z–A',
          sortRecent: 'Recientes',
          sortOldest: 'Antiguos',
          filterLinkLabel: 'Enlace',
          filterLinkAll: 'Todos',
          filterLinkWithExtra: 'Deploy',
          filterLinkRepoOnly: 'Solo repo',
          filterStackLabel: 'Stack',
          filterStackAll: 'Todos',
          filterStackJava: 'Java',
          filterStackLaravel: 'Laravel',
          filterStackReact: 'React',
          filterStackOther: 'Otros',
          clearFilters: 'Limpiar',
          noResults: 'Sin coincidencias.',
          noResultsTitle: 'Sin resultados',
          noResultsBody:
            'No hay proyectos que coincidan. Prueba otra palabra (solo títulos y tecnologías), cambia orden, enlace o stack, o pulsa Limpiar para buscar de nuevo.',
          noResultsCta: 'Limpiar y volver a ver todos',
          filtersSheetTitle: 'Filtros',
          openFiltersAria: 'Abrir filtros',
          closeSheetAria: 'Cerrar',
          filtersApplyDone: 'Listo',
          repo: 'Repositorio',
          live: 'Proyecto',
          downloadDirect: 'Descargar',
          ditechPeru: 'Ditech Perú — Marca y e-commerce LED',
          ledWeb: 'LED Web — Productos, ventas y pedidos',
          verses: 'Versículos Bíblicos — Meditación (ES/EN)',
          amigoSecreto: 'Amigo Secreto — Sorteo de nombres',
          juegoSecreto: 'Juego del número secreto',
          capturaApp: 'CapturaApp — Grabación y capturas en Windows',
          foroHub: 'ForoHub — Foro y autenticación',
          conversorMonedas: 'Conversor de monedas — Challenge CLI',
          literalura: 'Literalura — Biblioteca con Gutendex',
          nutriCalc: 'NutriCalc — Valoración nutricional en el navegador',
        },
        experience: {
          title: 'Experiencia Profesional',
          subtitle:
            'Mi trayectoria profesional y los roles donde he contribuido',
          viewMore: 'Ver más',
          viewLess: 'Ver menos',
          openTimeline: 'Ver línea de tiempo',
          timelineTitle: 'Línea de tiempo de experiencia',
          jobs: {
            blanc: {
              company: 'BLANC LABS',
              role: 'Associate (Contrato de formación)',
              location: 'Remoto, Trujillo, Perú',
              duration: 'Oct. 2024 – Actualidad',
              responsibilities: {
                r1: 'Participación en sesiones de conocimiento y grupos de aprendizaje multidisciplinarios orientados a la transformación digital en los sectores financiero y de salud.',
                r2: 'Exploración de desafíos de transformación digital y análisis de cómo la tecnología puede ofrecer soluciones prácticas.',
              },
            },
            ditech: {
              company: 'DITECH PERU',
              role: 'Desarrollador Web',
              location: 'Trujillo, Perú',
              duration: 'Enero 2025 – Actualidad',
              responsibilities: {
                r1: 'Desarrollo de aplicaciones web usando Laravel, Angular, Java y React.',
                r2: 'Implementación de sistemas de gestión de productos y módulos internos.',
                r3: 'Integración de bases de datos y servicios backend para asegurar eficiencia y seguridad.',
                r4: 'Colaboración en proyectos web completos, desde planificación hasta despliegue.',
              },
            },
            continental: {
              company: 'Distribuciones Continental',
              role: 'Asistente Informático',
              location: 'Trujillo, Perú',
              duration: 'Enero 2025 – Junio 2025',
              responsibilities: {
                r1: 'Mantenimiento y soporte técnico de equipos informáticos.',
                r2: 'Gestión y administración de la red local.',
                r3: 'Resolución de problemas de software y hardware.',
              },
            },
          },
        },
        history: {
          title: 'Mi Historia',
          p1: 'Curiosamente, mi camino hacia la ingeniería de software no fue el plan original. En un inicio pensé en estudiar ciencias médicas, pero con el tiempo descubrí un interés genuino por la tecnología y el mundo del desarrollo de software. Esa curiosidad inicial se transformó en una pasión que me llevó a elegir esta carrera.',
          p2: 'Hoy soy <strong class="text-blue-700 dark:text-blue-300 font-medium">Ingeniero de Software con especialización en Inteligencia Artificial</strong>, graduado de SENATI, y he tenido la oportunidad de trabajar en el desarrollo de aplicaciones web y móviles.',
          p3: 'Domino tecnologías como <strong class="text-blue-700 dark:text-blue-300 font-medium">Java Spring Boot, Laravel, React, Xamarin.Forms y Firebase</strong>, aplicando <strong class="text-blue-700 dark:text-blue-300 font-medium">patrones MVC y MVVM</strong>, <strong class="text-blue-700 dark:text-blue-300 font-medium">arquitectura limpia</strong>, diseño <strong class="text-blue-700 dark:text-blue-300 font-medium">en capas</strong>, estructura <strong class="text-blue-700 dark:text-blue-300 font-medium">modular</strong> y los <strong class="text-blue-700 dark:text-blue-300 font-medium">principios SOLID</strong>. Entre mis experiencias más destacadas están la creación de <strong class="text-blue-700 dark:text-blue-300 font-medium">APIs REST, sistemas CRUD, carouseles dinámicos y soluciones de e-commerce</strong>.',
          p4: 'Además, cuento con certificación en <em class="text-blue-600 dark:text-blue-300">Análisis de Datos – Google Analytics Capstone</em>, lo que me permite unir el desarrollo de software con el análisis inteligente de datos para tomar decisiones basadas en información real.',
          p5: 'Con el tiempo aprendí a valorar mi carrera, no solo como una profesión, sino como una oportunidad de crear soluciones escalables, seguras y centradas en el usuario. La innovación tecnológica se ha convertido en mi mayor motivación para seguir creciendo.',
          viewMore: 'Ver más',
          viewLess: 'Ver menos',
          voiceIconPlay: 'Leer historia en voz',
          voiceStopButton: 'Detener lectura',
          voiceSpeedAria: 'Velocidad de lectura',
          voiceSpeedSlow: 'Lenta',
          voiceSpeedNormal: 'Normal',
          voiceSpeedFast: 'Rápida',
          voiceSpeedVeryFast: 'Muy rápida',
          voiceApproxSec: '~{0} s',
          voiceApproxMin: '~{0} min',
        },
        study: {
          title: 'Formación',
          education: {
            title: 'Ingeniería de Software',
            institution: 'SENATI',
            specialization: 'Especialización en IA',
          },
          certifications: {
            title: 'Certificaciones',
          },
          stats: {
            title: 'Stats',
            experience: 'Experiencia',
            projects: 'Proyectos',
            clients: 'Clientes',
            location: 'Ubicación',
            years: '3+ años',
            projectsCount: '10+',
            clientsCount: '10+',
            city: 'Trujillo, Pe',
          },
        },
        hero: {
          greeting: 'Hola, soy',
          role: 'Ingeniero de Software',
          available: 'Disponible para nuevos proyectos',
          availableShort: 'Disponible',
          description:
            'Especialista en forjar experiencias digitales excepcionales con React, Angular y Node.js. Arquitecto de soluciones escalables que fusionan diseño premium con alto rendimiento tecnológico.',
          viewProjects: 'Ver mis Proyectos',
          visitCompany: 'Visitar SysJoL',
          viewCV: 'Ver Currículum',
          downloadCV: 'Descargar CV',
          cvPath: '/assets/pdf/jhony-lezama-cv-es.pdf',
          location: 'Trujillo, Perú',
        },
        contact: {
          title: '¿Trabajamos juntos?',
          description:
            'Estoy disponible para nuevos proyectos y colaboraciones. Hablemos sobre tu próxima idea y cómo puedo ayudarte a hacerla realidad.',
          responseTime: 'Tiempo de respuesta promedio: 24 horas',
          sheetBadges: {
            instant: 'Respuesta al instante',
            experience: '+3 años de experiencia',
          },
          sheetReplyHint:
            'Te responderé tan pronto como lea tu mensaje.',
          form: {
            title: 'Envíame un mensaje',
            name: 'Nombre',
            namePlaceholder: 'Tu nombre',
            email: 'Email',
            subject: 'Asunto',
            subjectPlaceholder: 'Asunto del mensaje',
            message: 'Mensaje',
            messagePlaceholder: 'Escribe tu mensaje aquí...',
            send: 'Enviar Mensaje',
            sending: 'Enviando...',
            success: '¡Mensaje Enviado!',
            successDesc:
              'Tu mensaje ha sido recibido con éxito. Te responderé pronto.',
            wait: 'Cargando...',
            required: 'Este campo es obligatorio',
          },
          info: {
            title: 'Información de contacto',
            email: 'Email',
            emailBtn: 'Hablemos por Email',
            whatsappBtn: 'WhatsApp Directo',
            phone: 'Teléfono',
            location: 'Ubicación',
            availability: 'Disponibilidad',
            hours: 'Lun - Vie, 9:00 - 18:00',
          },
          social: {
            title: 'Sígueme en redes',
          },
          services: {
            title: 'Servicios',
            fullstack: 'Desarrollo Web Full-Stack',
            mobile: 'Aplicaciones Móviles',
            consulting: 'Consultoría Técnica',
            audit: 'Auditoría de Código',
            mentoring: 'Mentoring & Formación',
          },
        },
        footer: {
          rights: 'Todos los derechos reservados',
          madeWith: 'Hecho con',
          in: 'en',
          /** Estado “disponible” solo en footer: mensaje corto + CTA. */
          availabilityShort: 'Disponible',
          availability: 'Listo para nuevos desafíos',
        },
        errors: {
          pageTitle: 'Error',
          backHome: 'Volver al inicio',
          goContact: 'Ir a contacto',
          tryAgain: 'Recargar página',
          generic: {
            title: 'Algo salió mal',
            body: 'No pudimos mostrar lo que pediste. Prueba más tarde o vuelve al inicio.',
          },
          e400: {
            title: 'Solicitud incorrecta',
            body: 'La petición no es válida o está mal formada.',
          },
          e401: {
            title: 'No autorizado',
            body: 'Necesitas autenticarte para acceder a este recurso.',
          },
          e403: {
            title: 'Acceso denegado',
            body: 'No tienes permiso para ver esta página.',
          },
          e404: {
            title: 'Página no encontrada',
            body: 'La URL no existe o fue movida. Revisa el enlace o vuelve al inicio.',
          },
          e405: {
            title: 'Método no permitido',
            body: 'Esta acción no está permitida en este recurso.',
          },
          e408: {
            title: 'Tiempo agotado',
            body: 'La solicitud tardó demasiado. Inténtalo de nuevo.',
          },
          e409: {
            title: 'Conflicto',
            body: 'La petición no se pudo completar por un conflicto con el estado actual.',
          },
          e410: {
            title: 'Ya no existe',
            body: 'El recurso fue eliminado de forma permanente.',
          },
          e413: {
            title: 'Contenido demasiado grande',
            body: 'Lo que intentas enviar supera el tamaño permitido.',
          },
          e415: {
            title: 'Formato no soportado',
            body: 'El tipo de medio no es aceptado.',
          },
          e429: {
            title: 'Demasiadas solicitudes',
            body: 'Has superado el límite permitido. Espera un momento e inténtalo de nuevo.',
          },
          e500: {
            title: 'Error del servidor',
            body: 'Algo falló en el servidor. Inténtalo más tarde.',
          },
          e501: {
            title: 'No implementado',
            body: 'El servidor no puede completar esta solicitud.',
          },
          e502: {
            title: 'Pasarela no válida',
            body: 'El servidor intermedio recibió una respuesta inválida.',
          },
          e503: {
            title: 'Servicio no disponible',
            body: 'El servicio está en mantenimiento o saturado. Vuelve en unos minutos.',
          },
          e504: {
            title: 'Tiempo de espera de pasarela',
            body: 'El servidor tardó demasiado en responder.',
          },
        },
        welcome: {
          kicker: 'Bienvenido',
          title: 'Jhony Lezama',
          subtitle:
            'Este es mi portafolio: proyectos, experiencia y formas de contacto. Gracias por visitar.',
          cta: 'Entrar al portafolio',
          hint: 'Solo verás esta pantalla una vez en este dispositivo. Puedes cambiar idioma y tema cuando quieras.',
        },
        toast: {
          error: 'Error',
          success: 'Correcto',
          offlineTitle: 'Sin conexión',
          offlineBody:
            'No hay conexión a internet. Revisa tu red; los envíos y descargas pueden fallar.',
          onlineTitle: 'Conexión restaurada',
          onlineBody: 'Vuelves a tener conexión a internet.',
          contactValidationTitle: 'Datos incompletos',
          contactValidationBody:
            'Completa los campos obligatorios: nombre, correo y asunto.',
          contactEmailInvalidTitle: 'Correo no válido',
          contactEmailInvalidBody: 'Introduce una dirección de correo válida.',
          contactSendFailedTitle: 'No se pudo enviar',
          contactSendFailedBody:
            'El mensaje no se envió. Inténtalo más tarde o escríbeme por correo.',
          downloadFailedTitle: 'Descarga fallida',
          downloadFailedBody: 'No se pudo descargar el archivo.',
          fileNotFoundTitle: 'Archivo no encontrado',
          fileNotFoundBody:
            'El archivo no está disponible o se movió de ubicación.',
          networkTitle: 'Error de red',
          networkBody:
            'No se pudo completar la operación. Comprueba tu conexión.',
          imageLoadTitle: 'Imagen no disponible',
          imageLoadBody: 'Se muestra una imagen por defecto en la tarjeta.',
        },
        common: {
          close: 'Cerrar',
        },
      },
      en: {
        meta: {
          title: "Jhony Lezama's Portfolio",
        },
        nav: {
          home: 'Home',
          about: 'About Me',
          skills: 'Skills',
          projects: 'Projects',
          experience: 'Experience',
          contact: 'Contact',
          quickLinks: 'Quick Links',
          socialMedia: 'Professional Networks',
        },
        header: {
          role: 'Developer',
        },
        sidebar: {
          role: 'Software Engineer',
        },
        mobile: {
          role: 'Full Stack Developer',
          findMe: 'Find me on',
        },
        about: {
          technologiesTitle: 'Technologies',
          techCarouselPrev: 'Previous technologies',
          techCarouselNext: 'Next technologies',
          mastered: 'Mastered',
          title: 'About Me',
          description:
            'A glimpse into my journey, professional training and what drives me to create technology.',
        },
        skills: {
          title: 'Technical Skills',
          description:
            'Ecosystem of technologies and tools that I use to materialize ideas into digital solutions.',
          frontend: 'Frontend',
          backend: 'Backend',
          database: 'Database',
          devops: 'DevOps & Cloud',
          desktop: 'Desktop & native',
          mobile: 'Mobile',
          ai: 'AI & AR',
          data_analyst: 'Data Analyst',
        },
        projects: {
          title: 'Featured Projects',
          subtitle: 'Some of the most interesting projects I have worked on',
          viewMore: 'View more',
          viewLess: 'View less',
          searchPlaceholder: 'Search…',
          sortLabel: 'Sort',
          sortDefault: 'Featured',
          sortAz: 'A–Z',
          sortZa: 'Z–A',
          sortRecent: 'Newest',
          sortOldest: 'Oldest',
          filterLinkLabel: 'Link',
          filterLinkAll: 'All',
          filterLinkWithExtra: 'Deploy',
          filterLinkRepoOnly: 'Repo only',
          filterStackLabel: 'Stack',
          filterStackAll: 'All',
          filterStackJava: 'Java',
          filterStackLaravel: 'Laravel',
          filterStackReact: 'React',
          filterStackOther: 'Other',
          clearFilters: 'Reset',
          noResults: 'No matches.',
          noResultsTitle: 'No results',
          noResultsBody:
            'Nothing matches your filters. Try other words (titles & tech only), change sort, link or stack, or tap Reset to show everything again.',
          noResultsCta: 'Reset and show all',
          filtersSheetTitle: 'Filters',
          openFiltersAria: 'Open filters',
          closeSheetAria: 'Close',
          filtersApplyDone: 'Done',
          repo: 'Repository',
          live: 'Live Project',
          downloadDirect: 'Download',
          ditechPeru: 'Ditech Peru — LED brand & e-commerce',
          ledWeb: 'LED Web — Products, sales & orders',
          verses: 'Bible Verses — Meditation (ES/EN)',
          amigoSecreto: 'Secret Santa — Name draw',
          juegoSecreto: 'Secret number game',
          capturaApp: 'CapturaApp — Screen capture for Windows',
          foroHub: 'ForoHub — Forum & authentication',
          conversorMonedas: 'Currency converter — CLI challenge',
          literalura: 'Literalura — Library with Gutendex',
          nutriCalc: 'NutriCalc — Nutrition tools in the browser',
        },
        experience: {
          title: 'Professional Experience',
          subtitle:
            'My professional journey and the roles where I have contributed',
          viewMore: 'View more',
          viewLess: 'View less',
          openTimeline: 'View timeline',
          timelineTitle: 'Experience timeline',
          jobs: {
            blanc: {
              company: 'BLANC LABS',
              role: 'Associate (Training Contract)',
              location: 'Remote, Trujillo, Peru',
              duration: 'Oct 2024 – Present',
              responsibilities: {
                r1: 'Participation in knowledge sessions and multidisciplinary learning groups oriented towards digital transformation in the financial and health sectors.',
                r2: 'Exploration of digital transformation challenges and analysis of how technology can offer practical solutions.',
              },
            },
            ditech: {
              company: 'DITECH PERU',
              role: 'Web Developer',
              location: 'Trujillo, Peru',
              duration: 'Jan 2025 – Present',
              responsibilities: {
                r1: 'Web application development using Laravel, Angular, Java, and React.',
                r2: 'Implementation of product management systems and internal modules.',
                r3: 'Integration of databases and backend services to ensure efficiency and security.',
                r4: 'Collaboration on full web projects, from planning to deployment.',
              },
            },
            continental: {
              company: 'Distribuciones Continental',
              role: 'IT Assistant',
              location: 'Trujillo, Peru',
              duration: 'Jan 2025 – June 2025',
              responsibilities: {
                r1: 'Maintenance and technical support of computer equipment.',
                r2: 'Management and administration of the local network.',
                r3: 'Resolution of software and hardware problems.',
              },
            },
          },
        },
        history: {
          title: 'My History',
          p1: 'Curiously, my path to software engineering was not the original plan. Initially, I thought about studying medical sciences, but over time I discovered a genuine interest in technology and the world of software development. That initial curiosity turned into a passion that led me to choose this career.',
          p2: 'Today I am a <strong class="text-blue-700 dark:text-blue-300 font-medium">Software Engineer with a specialization in Artificial Intelligence</strong>, graduated from SENATI, and I have had the opportunity to work on developing web and mobile applications.',
          p3: 'I master technologies such as <strong class="text-blue-700 dark:text-blue-300 font-medium">Java Spring Boot, Laravel, React, Xamarin.Forms and Firebase</strong>, applying <strong class="text-blue-700 dark:text-blue-300 font-medium">MVC and MVVM patterns</strong>, <strong class="text-blue-700 dark:text-blue-300 font-medium">Clean Architecture</strong>, <strong class="text-blue-700 dark:text-blue-300 font-medium">layered</strong> architecture, <strong class="text-blue-700 dark:text-blue-300 font-medium">modular</strong> structure and the <strong class="text-blue-700 dark:text-blue-300 font-medium">SOLID principles</strong>. Among my most notable experiences are the creation of <strong class="text-blue-700 dark:text-blue-300 font-medium">REST APIs, CRUD systems, dynamic carousels and e-commerce solutions</strong>.',
          p4: 'In addition, I have certification in <em class="text-blue-600 dark:text-blue-300">Data Analytics – Google Analytics Capstone</em>, which allows me to combine software development with intelligent data analysis to make decisions based on real information.',
          p5: 'Over time I learned to value my career, not only as a profession, but as an opportunity to create scalable, secure and user-centered solutions. Technological innovation has become my biggest motivation to keep growing.',
          viewMore: 'Read more',
          viewLess: 'Read less',
          voiceIconPlay: 'Read story aloud',
          voiceStopButton: 'Stop reading',
          voiceSpeedAria: 'Reading speed',
          voiceSpeedSlow: 'Slow',
          voiceSpeedNormal: 'Normal',
          voiceSpeedFast: 'Fast',
          voiceSpeedVeryFast: 'Very fast',
          voiceApproxSec: '~{0} s',
          voiceApproxMin: '~{0} min',
        },
        study: {
          title: 'Education',
          education: {
            title: 'Software Engineering',
            institution: 'SENATI',
            specialization: 'AI Specialization',
          },
          certifications: {
            title: 'Certifications',
          },
          stats: {
            title: 'Stats',
            experience: 'Experience',
            projects: 'Projects',
            clients: 'Clients',
            location: 'Location',
            years: '3+ years',
            projectsCount: '10+',
            clientsCount: '10+',
            city: 'Trujillo, Pe',
          },
        },
        hero: {
          greeting: "Hi, I'm",
          role: 'Software Engineer',
          available: 'Available for new projects',
          availableShort: 'Available',
          description:
            'Specialist in crafting exceptional digital experiences with React, Angular and Node.js. Architect of scalable solutions that merge premium design with high technological performance.',
          viewProjects: 'View my Projects',
          visitCompany: 'Visit SysJoL',
          viewCV: 'View Resume',
          downloadCV: 'Download CV',
          cvPath: '/assets/pdf/jhony-lezama-cv-en.pdf',
          location: 'Trujillo, Peru',
        },
        contact: {
          title: "Let's work together?",
          description:
            "I'm available for new projects and collaborations. Let's talk about your next idea and how I can help you make it a reality.",
          responseTime: 'Average response time: 24 hours',
          sheetBadges: {
            instant: 'Fast reply',
            experience: '3+ years experience',
          },
          sheetReplyHint:
            "I'll reply as soon as I've read your message.",
          form: {
            title: 'Send me a message',
            name: 'Name',
            namePlaceholder: 'Your name',
            email: 'Email',
            subject: 'Subject',
            subjectPlaceholder: 'Message subject',
            message: 'Message',
            messagePlaceholder: 'Write your message here...',
            send: 'Send Message',
            sending: 'Sending...',
            success: 'Message Sent!',
            successDesc:
              'Your message has been received successfully. I will get back to you soon.',
            wait: 'Loading...',
            required: 'This field is required',
          },
          info: {
            title: 'Contact Information',
            email: 'Email',
            emailBtn: "Let's talk by Email",
            whatsappBtn: 'Direct WhatsApp',
            phone: 'Phone',
            location: 'Location',
            availability: 'Availability',
            hours: 'Mon - Fri, 9:00 - 18:00',
          },
          social: {
            title: 'Follow me',
          },
          services: {
            title: 'Services',
            fullstack: 'Full-Stack Web Development',
            mobile: 'Mobile Applications',
            consulting: 'Technical Consulting',
            audit: 'Code Audit',
            mentoring: 'Mentoring & Training',
          },
        },
        footer: {
          rights: 'All rights reserved',
          madeWith: 'Made with',
          in: 'in',
          availabilityShort: 'Available',
          availability: 'Ready for new challenges',
        },
        errors: {
          pageTitle: 'Error',
          backHome: 'Back to home',
          goContact: 'Contact',
          tryAgain: 'Reload page',
          generic: {
            title: 'Something went wrong',
            body: 'We could not show what you requested. Try again later or go back home.',
          },
          e400: {
            title: 'Bad request',
            body: 'The request is invalid or malformed.',
          },
          e401: {
            title: 'Unauthorized',
            body: 'You need to sign in to access this resource.',
          },
          e403: {
            title: 'Forbidden',
            body: 'You do not have permission to view this page.',
          },
          e404: {
            title: 'Page not found',
            body: 'This URL does not exist or was moved. Check the link or return home.',
          },
          e405: {
            title: 'Method not allowed',
            body: 'This action is not allowed for this resource.',
          },
          e408: {
            title: 'Request timeout',
            body: 'The request took too long. Please try again.',
          },
          e409: {
            title: 'Conflict',
            body: 'The request could not be completed due to a conflict with the current state.',
          },
          e410: {
            title: 'Gone',
            body: 'This resource has been permanently removed.',
          },
          e413: {
            title: 'Payload too large',
            body: 'What you are trying to send exceeds the allowed size.',
          },
          e415: {
            title: 'Unsupported media type',
            body: 'The media type is not accepted.',
          },
          e429: {
            title: 'Too many requests',
            body: 'You have exceeded the allowed limit. Wait a moment and try again.',
          },
          e500: {
            title: 'Internal server error',
            body: 'Something went wrong on the server. Please try again later.',
          },
          e501: {
            title: 'Not implemented',
            body: 'The server cannot fulfill this request.',
          },
          e502: {
            title: 'Bad gateway',
            body: 'An upstream server returned an invalid response.',
          },
          e503: {
            title: 'Service unavailable',
            body: 'The service is under maintenance or overloaded. Try again shortly.',
          },
          e504: {
            title: 'Gateway timeout',
            body: 'The server took too long to respond.',
          },
        },
        welcome: {
          kicker: 'Welcome',
          title: 'Jhony Lezama',
          subtitle:
            'This is my portfolio: projects, experience, and ways to get in touch. Thanks for stopping by.',
          cta: 'Enter portfolio',
          hint: 'You will only see this screen once on this device. You can switch language and theme anytime.',
        },
        toast: {
          error: 'Error',
          success: 'Done',
          offlineTitle: 'You are offline',
          offlineBody:
            'There is no internet connection. Sending messages or downloading files may fail.',
          onlineTitle: 'Back online',
          onlineBody: 'Your internet connection was restored.',
          contactValidationTitle: 'Missing fields',
          contactValidationBody:
            'Please fill in the required fields: name, email and subject.',
          contactEmailInvalidTitle: 'Invalid email',
          contactEmailInvalidBody: 'Enter a valid email address.',
          contactSendFailedTitle: 'Message not sent',
          contactSendFailedBody:
            'The message could not be sent. Try again later or email me directly.',
          downloadFailedTitle: 'Download failed',
          downloadFailedBody: 'The file could not be downloaded.',
          fileNotFoundTitle: 'File not found',
          fileNotFoundBody:
            'The file is not available or may have been moved.',
          networkTitle: 'Network error',
          networkBody:
            'The operation could not be completed. Check your connection.',
          imageLoadTitle: 'Image unavailable',
          imageLoadBody: 'A placeholder image is shown on the card.',
        },
        common: {
          close: 'Close',
        },
      },
    });
  }
}

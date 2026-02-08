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
  private activatedRoute = inject(ActivatedRoute);

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
        let route = this.activatedRoute;
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
          repo: 'Repositorio',
          live: 'Proyecto',
          ecommerce: 'E-commerce Web',
          blog: 'Blog Personal',
          led: 'E-Commerce para Pantallas LED',
          crm: 'Sistema de Gestión de Clientes',
          portfolio: 'Portafolio Personal',
        },
        experience: {
          title: 'Experiencia Profesional',
          subtitle:
            'Mi trayectoria profesional y los roles donde he contribuido',
          viewMore: 'Ver más',
          viewLess: 'Ver menos',
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
          p3: 'Domino tecnologías como <strong class="text-blue-700 dark:text-blue-300 font-medium">Java Spring Boot, Laravel, React, Xamarin.Forms y Firebase</strong>, aplicando arquitecturas <strong class="text-blue-700 dark:text-blue-300 font-medium">MVC</strong> y <strong class="text-blue-700 dark:text-blue-300 font-medium">MVVM</strong>. Entre mis experiencias más destacadas están la creación de <strong class="text-blue-700 dark:text-blue-300 font-medium">APIs REST, sistemas CRUD, carouseles dinámicos y soluciones de e-commerce</strong>.',
          p4: 'Además, cuento con certificación en <em class="text-blue-600 dark:text-blue-300">Análisis de Datos – Google Analytics Capstone</em>, lo que me permite unir el desarrollo de software con el análisis inteligente de datos para tomar decisiones basadas en información real.',
          p5: 'Con el tiempo aprendí a valorar mi carrera, no solo como una profesión, sino como una oportunidad de crear soluciones escalables, seguras y centradas en el usuario. La innovación tecnológica se ha convertido en mi mayor motivación para seguir creciendo.',
          viewMore: 'Ver más',
          viewLess: 'Ver menos',
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
          description:
            'Especialista en forjar experiencias digitales excepcionales con React, Angular y Node.js. Arquitecto de soluciones escalables que fusionan diseño premium con alto rendimiento tecnológico.',
          viewProjects: 'Ver mis Proyectos',
          downloadCV: 'Descargar CV',
          cvPath: '/assets/pdf/jhony-lezama-cv-es.pdf',
          location: 'Trujillo, Perú',
        },
        contact: {
          title: '¿Trabajamos juntos?',
          description:
            'Estoy disponible para nuevos proyectos y colaboraciones. Hablemos sobre tu próxima idea y cómo puedo ayudarte a hacerla realidad.',
          responseTime: 'Tiempo de respuesta promedio: 24 horas',
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
          mobile: 'Mobile',
          ai: 'AI & AR',
          data_analyst: 'Data Analyst',
        },
        projects: {
          title: 'Featured Projects',
          subtitle: 'Some of the most interesting projects I have worked on',
          viewMore: 'View more',
          viewLess: 'View less',
          repo: 'Repository',
          live: 'Live Project',
          ecommerce: 'E-commerce Web',
          blog: 'Personal Blog',
          led: 'LED Screen E-Commerce',
          crm: 'Customer Management System',
          portfolio: 'Personal Portfolio',
        },
        experience: {
          title: 'Professional Experience',
          subtitle:
            'My professional journey and the roles where I have contributed',
          viewMore: 'View more',
          viewLess: 'View less',
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
          p3: 'I master technologies such as <strong class="text-blue-700 dark:text-blue-300 font-medium">Java Spring Boot, Laravel, React, Xamarin.Forms and Firebase</strong>, applying <strong class="text-blue-700 dark:text-blue-300 font-medium">MVC</strong> and <strong class="text-blue-700 dark:text-blue-300 font-medium">MVVM</strong> architectures. Among my most notable experiences are the creation of <strong class="text-blue-700 dark:text-blue-300 font-medium">REST APIs, CRUD systems, dynamic carousels and e-commerce solutions</strong>.',
          p4: 'In addition, I have certification in <em class="text-blue-600 dark:text-blue-300">Data Analytics – Google Analytics Capstone</em>, which allows me to combine software development with intelligent data analysis to make decisions based on real information.',
          p5: 'Over time I learned to value my career, not only as a profession, but as an opportunity to create scalable, secure and user-centered solutions. Technological innovation has become my biggest motivation to keep growing.',
          viewMore: 'Read more',
          viewLess: 'Read less',
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
          description:
            'Specialist in crafting exceptional digital experiences with React, Angular and Node.js. Architect of scalable solutions that merge premium design with high technological performance.',
          viewProjects: 'View my Projects',
          downloadCV: 'Download CV',
          cvPath: '/assets/pdf/jhony-lezama-cv-en.pdf',
          location: 'Trujillo, Peru',
        },
        contact: {
          title: "Let's work together?",
          description:
            "I'm available for new projects and collaborations. Let's talk about your next idea and how I can help you make it a reality.",
          responseTime: 'Average response time: 24 hours',
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
        },
      },
    });
  }
}

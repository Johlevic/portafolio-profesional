import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '@/environments/environment';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@/app/components/alerts/alert/alert.component';
import { LanguageService } from '@/app/services/language.service';
import { BottomSheetService } from '@/app/services/bottom-sheet.service';
import { LoadingModalService } from '@/app/services/loading-modal.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent, ScrollRevealDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  languageService = inject(LanguageService);
  private bottomSheetService = inject(BottomSheetService);
  private loadingModalService = inject(LoadingModalService);

  @ViewChild('formRef', { read: ElementRef })
  formRef!: ElementRef<HTMLFormElement>;

  // Alerta
  alert: { type: AlertType; title: string; message: string } | null = null;

  // Estados de envío
  private progressInterval: any;

  enviarMensaje() {
    if (!this.formRef) return;
    const formEl = this.formRef.nativeElement;

    // Obtener valores
    const name = (
      formEl.querySelector<HTMLInputElement>('input[name="name"]')?.value || ''
    ).trim();
    const email = (
      formEl.querySelector<HTMLInputElement>('input[name="email"]')?.value || ''
    ).trim();
    const subject = (
      formEl.querySelector<HTMLInputElement>('input[name="subject"]')?.value ||
      ''
    ).trim();
    const message = (
      formEl.querySelector<HTMLTextAreaElement>('textarea[name="message"]')
        ?.value || ''
    ).trim();

    // Validaciones (message es opcional)
    if (!name || !email || !subject) {
      this.alert = {
        type: 'error',
        title: 'Error',
        message:
          'Completa todos los campos obligatorios (Nombre, Email y Asunto)',
      };
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.alert = {
        type: 'error',
        title: 'Error',
        message: 'Ingresa un correo válido',
      };
      return;
    }

    // Hora local
    const fecha = new Date();
    const horaLocal = fecha.toLocaleString('es-PE', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    const hiddenInput =
      formEl.querySelector<HTMLInputElement>('input[name="time"]');
    if (hiddenInput) hiddenInput.value = horaLocal;

    // Activar Modal de Carga
    this.loadingModalService.show('contact.form.sending', 'contact.form.wait');

    // Simular progreso hasta el 90%
    this.progressInterval = setInterval(() => {
      const currentProgress = this.loadingModalService.state().progress;
      if (currentProgress < 90) {
        this.loadingModalService.setProgress(
          currentProgress + Math.random() * 15,
        );
        if (this.loadingModalService.state().progress > 90) {
          this.loadingModalService.setProgress(90);
        }
      }
    }, 200);

    // Enviar con EmailJS (Dual: Notificación al dueño y Confirmación al usuario)
    const emailPromises = [];

    // 1. Notificación al dueño (siempre se envía)
    emailPromises.push(
      emailjs.sendForm(
        environment.emailServiceID,
        environment.emailTemplateID,
        formEl,
        environment.emailUserID,
      ),
    );

    // 2. Confirmación al usuario (solo si existe el Template ID en environment)
    if (environment.emailConfirmationTemplateID) {
      emailPromises.push(
        emailjs.sendForm(
          environment.emailServiceID,
          environment.emailConfirmationTemplateID,
          formEl,
          environment.emailUserID,
        ),
      );
    }

    Promise.all(emailPromises)
      .then(() => {
       
        clearInterval(this.progressInterval);
        this.loadingModalService.setProgress(100);
        this.loadingModalService.setSuccess(true);

        // Limpiar formulario y cerrar modal después de 2.5 segundos
        setTimeout(() => {
          formEl.reset();
          this.loadingModalService.hide();
        }, 2500);
      })
      .catch((error) => {
       
        clearInterval(this.progressInterval);
        this.loadingModalService.hide();
        this.alert = {
          type: 'error',
          title: 'Error al enviar',
          message:
            'Hubo un problema al enviar el mensaje. Tu notificación podría no haberse enviado correctamente.',
        };
      });
  }

  cerrarAlerta() {
    this.alert = null;
  }

  openContactSheet(): void {
    this.bottomSheetService.open({
      title: this.languageService.t('contact.info.title'),
      icon: 'bi bi-info-circle',
      type: 'list',
      items: [
        {
          label: this.languageService.t('contact.info.email'),
          value: 'jlezamavictorio@gmail.com',
          icon: 'bi bi-envelope-fill',
        },
        {
          label: this.languageService.t('contact.info.phone'),
          value: '+51 980609176',
          icon: 'bi bi-telephone-fill',
        },
        {
          label: this.languageService.t('contact.info.location'),
          value: 'Trujillo, Perú',
          icon: 'bi bi-geo-alt-fill',
        },
        {
          label: this.languageService.t('contact.info.availability'),
          value: this.languageService.t('contact.info.hours'),
          icon: 'bi bi-calendar-fill',
        },
      ],
    });
  }

  openSocialSheet(): void {
    this.bottomSheetService.open({
      title: this.languageService.t('contact.social.title'),
      icon: 'bi bi-share',
      type: 'social',
      items: [
        {
          label: 'GitHub',
          value: '@Johlevic',
          icon: 'bi bi-github',
          link: 'https://github.com/Johlevic/',
        },
        {
          label: 'LinkedIn',
          value: '@jhony-lezama',
          icon: 'bi bi-linkedin',
          link: 'https://www.linkedin.com/in/jhony-lezama/',
        },
        {
          label: 'Facebook',
          value: '@CodeJhoLe',
          icon: 'bi bi-facebook',
          link: 'https://web.facebook.com/CodeJhoLe/',
        },
        {
          label: 'YouTube',
          value: '@CodeJL-Tech',
          icon: 'bi bi-youtube',
          link: 'https://www.youtube.com/@CodeJL-Tech',
        },
        {
          label: 'TikTok',
          value: '@code_jl',
          icon: 'bi bi-tiktok',
          link: 'https://www.tiktok.com/@code_jl',
        },
        {
          label: 'X (Twitter)',
          value: '@EJLeVic',
          icon: 'bi bi-twitter-x',
          link: 'https://x.com/EJLeVic/',
        },
      ],
    });
  }
}

import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '@/environments/environment';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@/app/components/alerts/alert/alert.component';
import { LanguageService } from '@/app/services/language.service';

type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  languageService = inject(LanguageService);

  @ViewChild('formRef', { read: ElementRef })
  formRef!: ElementRef<HTMLFormElement>;

  // Alerta
  alert: { type: AlertType; title: string; message: string } | null = null;

  enviarMensaje() {
    if (!this.formRef) return;
    const formEl = this.formRef.nativeElement;

    // Obtener valores
    const nombre = (
      formEl.querySelector<HTMLInputElement>('input[name="nombre"]')?.value ||
      ''
    ).trim();
    const email = (
      formEl.querySelector<HTMLInputElement>('input[name="email"]')?.value || ''
    ).trim();
    const asunto = (
      formEl.querySelector<HTMLInputElement>('input[name="asunto"]')?.value ||
      ''
    ).trim();
    const mensaje = (
      formEl.querySelector<HTMLTextAreaElement>('textarea[name="mensaje"]')
        ?.value || ''
    ).trim();

    // Validaciones (mensaje es opcional)
    if (!nombre || !email || !asunto) {
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

    // Mostrar indicador de carga
    this.alert = {
      type: 'info',
      title: 'Enviando...',
      message: 'Por favor espera mientras se envía tu mensaje',
    };

    // Enviar con EmailJS
    emailjs
      .sendForm(
        environment.emailServiceID,
        environment.emailTemplateID,
        formEl,
        environment.emailUserID,
      )
      .then((response) => {
        console.log('✅ Mensaje enviado exitosamente:', response);
        formEl.reset();
        this.alert = {
          type: 'success',
          title: '¡Éxito!',
          message: 'Tu mensaje fue enviado con éxito. Te responderé pronto.',
        };
      })
      .catch((error) => {
        console.error('❌ Error al enviar mensaje:', error);
        console.error('Detalles del error:', {
          status: error.status,
          text: error.text,
          serviceID: environment.emailServiceID,
          templateID: environment.emailTemplateID,
        });
        this.alert = {
          type: 'error',
          title: 'Error al enviar',
          message:
            'Hubo un problema al enviar el mensaje. Por favor intenta de nuevo o contáctame directamente por email.',
        };
      });
  }

  cerrarAlerta() {
    this.alert = null;
  }
}

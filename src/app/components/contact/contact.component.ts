import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '@/environments/environment';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@/app/components/alerts/alert/alert.component'; // 👈 Importa tu alerta

type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  @ViewChild('formRef', { read: ElementRef }) formRef!: ElementRef<HTMLFormElement>;

  // Alerta
  alert: { type: AlertType; title: string; message: string } | null = null;

  enviarMensaje() {
    if (!this.formRef) return;
    const formEl = this.formRef.nativeElement;

    // Obtener valores
    const nombre = (formEl.querySelector<HTMLInputElement>('input[name="nombre"]')?.value || '').trim();
    const email = (formEl.querySelector<HTMLInputElement>('input[name="email"]')?.value || '').trim();
    const asunto = (formEl.querySelector<HTMLInputElement>('input[name="asunto"]')?.value || '').trim();
    const mensaje = (formEl.querySelector<HTMLTextAreaElement>('textarea[name="mensaje"]')?.value || '').trim();

    // Validaciones
    if (!nombre || !email || !asunto || !mensaje) {
      this.alert = {
        type: 'error',
        title: 'Error',
        message: 'Completa todos los campos obligatorios'
      };
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.alert = {
        type: 'error',
        title: 'Error',
        message: 'Ingresa un correo válido'
      };
      return;
    }

    // Hora local
    const fecha = new Date();
    const horaLocal = fecha.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
    const hiddenInput = formEl.querySelector<HTMLInputElement>('input[name="time"]');
    if (hiddenInput) hiddenInput.value = horaLocal;

    // Enviar con EmailJS
    emailjs.sendForm(environment.emailServiceID, environment.emailTemplateID, formEl, environment.emailUserID)
      .then(() => {
        formEl.reset();
        this.alert = {
          type: 'success',
          title: '¡Éxito!',
          message: 'Tu mensaje fue enviado con éxito'
        };
      })
      .catch((error) => {
        console.error('Error al enviar:', error);
        this.alert = {
          type: 'error',
          title: 'Error',
          message: 'Hubo un problema al enviar el mensaje'
        };
      });
  }

  cerrarAlerta() {
    this.alert = null;
  }
}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  @ViewChild('formRef') formRef!: ElementRef<HTMLFormElement>; // referencia al form HTML

  enviarMensaje() {
    if (this.formRef) {
      const serviceID = 'service_8hin2cp';
      const templateID = 'tu_template_id';
      const userID = 'tu_public_key';

      emailjs.sendForm(serviceID, templateID, this.formRef.nativeElement, userID)
        .then(() => {
          alert('¡Mensaje enviado con éxito!');
          this.formRef.nativeElement.reset();
        })
        .catch((error) => {
          console.error('Error al enviar:', error);
          alert('Hubo un error al enviar el mensaje.');
        });
    }
  }
}

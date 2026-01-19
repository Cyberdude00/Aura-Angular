import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../core/services/seo.service';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss']
})
// Aseguramos la exportación del componente
export class LandingComponent implements OnInit {
  imagePreviewSrc: string = 'images/aura-scouting-logo.png';
  isPreviewing: boolean = false;
  isSubmitting: boolean = false;
  selectedFile: File | null = null;

  formData = {
    name: '',
    email: '',
    height: '',
    cellphone: ''
  };

  constructor(
    private seoService: SeoService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.seoService.generateTags({
      title: 'Aura Scouting | International Scouting Model Agency',
      description: 'Aura Scouting is a modeling agency offering a scouting to connect agencies and promote talent from around the world. We connect Asia, America, and Europe.',
      keywords: 'modeling agency, model scouting, international models, model promotion, talent agency',
      image: 'https://www.aurascouting.com/assets/images/aura-scouting-logo.png',
      slug: '' // Home page
    });
    this.seoService.setCanonical('https://www.aurascouting.com/');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            this.imagePreviewSrc = reader.result as string;
            this.isPreviewing = true;
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert('Invalid file type. Only JPG, PNG, and GIF images are allowed.');
        this.resetImagePreview();
      }
    } else {
      this.resetImagePreview();
    }
  }

  resetImagePreview(): void {
    this.imagePreviewSrc = 'images/aura-scouting-logo.png';
    this.isPreviewing = false;
    this.selectedFile = null;
  }

  onSubmit(form: any): void {
    console.log('Submit fired', form);

    if (!this.selectedFile) {
      alert('Please attach an image.');
      return;
    }

    if (form.valid) {
      this.isSubmitting = true;

      const formDataToSend = new FormData();
      formDataToSend.append('name', this.formData.name);
      formDataToSend.append('email', this.formData.email);
      formDataToSend.append('height', this.formData.height);
      formDataToSend.append('cellphone', this.formData.cellphone);
      formDataToSend.append('image', this.selectedFile);

      this.contactService.sendEmail(formDataToSend).subscribe({
        next: () => {
          alert('Message sent successfully!');
          this.isSubmitting = false;
          form.reset();
          this.resetImagePreview();
        },
        error: (error: any) => {
          console.error('Error sending email', error);
          alert('There was an error sending the message. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }
}

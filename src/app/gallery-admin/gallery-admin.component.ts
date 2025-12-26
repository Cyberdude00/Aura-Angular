import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { GalleryService } from '../gallery.service';
import { Model } from '../model';

@Component({
  selector: 'app-gallery-admin',
  templateUrl: './gallery-admin.component.html',
  styleUrls: ['./gallery-admin.component.css']
})
export class GalleryAdminComponent implements OnInit {
  models$: Observable<Model[]>;
  modelForm: FormGroup;
  selectedModel: Model | null = null;
  isEditing = false;

  // Columnas para la tabla de modelos
  displayedColumns: string[] = ['name', 'gender', 'height', 'actions'];

  constructor(
    private galleryService: GalleryService,
    private fb: FormBuilder
  ) {
    this.models$ = this.galleryService.models$;
    this.modelForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['Hombres', Validators.required],
      height: [''],
      measurements: [''],
      hair: [''],
      eyes: [''],
      shoe: [''],
      photo: [''], // URL de la foto principal
      portfolio: [[]], // Array de URLs de imágenes
      instagram: [[]]
    });
  }

  ngOnInit(): void {}

  selectModel(model: Model): void {
    this.selectedModel = model;
    this.isEditing = true;
    this.modelForm.patchValue(model);
  }

  resetForm(): void {
    this.selectedModel = null;
    this.isEditing = false;
    this.modelForm.reset({
      gender: 'Hombres',
      portfolio: [],
      instagram: []
    });
  }

  saveModel(): void {
    if (this.modelForm.invalid) {
      return;
    }

    const formValue = this.modelForm.value;

    if (this.isEditing && this.selectedModel) {
      const updatedModel: Model = { ...this.selectedModel, ...formValue };
      this.galleryService.updateModel(updatedModel).subscribe(() => {
        this.resetForm();
      });
    } else {
      // Omit 'id' for new models
      const { id, ...newModelData } = formValue;
      this.galleryService.addModel(newModelData).subscribe(() => {
        this.resetForm();
      });
    }
  }

  deleteModel(modelId: number, event: MouseEvent): void {
    event.stopPropagation(); // Evita que el click se propague al row y seleccione el modelo
    if (confirm('Are you sure you want to delete this model?')) {
      this.galleryService.deleteModel(modelId).subscribe(()' => {
        if (this.selectedModel && this.selectedModel.id === modelId) {
            this.resetForm();
        }
      });
    }
  }

  // --- Image Upload Handlers (Mock Implementation) ---
  // NOTE: This is a mock implementation. In a real app, this would involve
  // uploading the file to a server and getting back a URL.

  onMainPhotoUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Mock: Create a local URL. In a real app, you'd upload this and get a URL from the server.
      const mockUrl = `assets/gallery/models/new/${file.name}`;
      this.modelForm.patchValue({ photo: mockUrl });
    }
  }

  onPortfolioUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const currentPortfolio = this.modelForm.get('portfolio')?.value || [];
      const newImageUrls = Array.from(files).map(file => 
        `assets/gallery/models/new/portfolio/${file.name}`
      );
      
      this.modelForm.patchValue({ portfolio: [...currentPortfolio, ...newImageUrls] });
    }
  }

  removePortfolioImage(imageUrl: string): void {
    const currentPortfolio = this.modelForm.get('portfolio')?.value || [];
    this.modelForm.patchValue({
      portfolio: currentPortfolio.filter((url: string) => url !== imageUrl)
    });
  }
}

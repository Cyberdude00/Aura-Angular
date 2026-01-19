import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ModelService } from '../services/model.service';
import { Model } from '../models/model.interface';
import { ModelCardComponent } from './model-card.component';
import { ModelDetailComponent } from './model-detail.component';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [CommonModule, ModelCardComponent, ModelDetailComponent],
  template: `
    <div class="gallery-container">
      <header class="header-inner">
        <div class="header-title">{{ region | titlecase }} Selection</div>
      </header>

      <main class="grid-container">
        <app-model-card
          *ngFor="let model of models"
          [model]="model"
          (select)="selectedModel = $event">
        </app-model-card>
      </main>

      <!-- Modal de Detalle -->
      <app-model-detail
        *ngIf="selectedModel"
        [model]="selectedModel"
        (close)="selectedModel = null">
      </app-model-detail>
    </div>
  `,
  styles: [`
    .gallery-container {
      min-height: 100vh;
      background: #181818;
      color: #fff;
      font-family: "IBM Plex Mono", monospace;
    }

    .header-inner {
      padding: 30px;
      text-align: center;
    }

    .header-title {
      font-size: 2rem;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      padding: 20px 4vw;
      max-width: 1400px;
      margin: 0 auto;
      justify-items: center;
    }

    @media (max-width: 1200px) {
      .grid-container {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
    }

    @media (max-width: 580px) {
      .grid-container {
        grid-template-columns: 1fr;
        padding: 15px 2vw 22px;
      }

      .header-title {
        font-size: 1.2rem;
      }
    }
  `]
})
export class SelectionComponent implements OnInit {
  models: Model[] = [];
  region: string = '';
  selectedModel: Model | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private modelService: ModelService) {}

  ngOnInit() {
    // Suscribirse a cambios en la URL (ej: de /korea a /china)
    this.route.paramMap.subscribe(params => {
      this.region = params.get('region') || '';
      if (this.region) {
        this.loadModels();
      }
    });
  }

  private loadModels() {
    this.isLoading = true;
    this.error = null;
    this.selectedModel = null;

    this.modelService.getModelsByRegion(this.region).subscribe({
      next: (data) => {
        this.models = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`Error loading models for region ${this.region}:`, err);
        this.error = `Failed to load models for ${this.region}`;
        this.models = [];
        this.isLoading = false;
      }
    });
  }
}

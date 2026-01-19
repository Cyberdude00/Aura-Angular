import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Model } from '../models/model.interface';
import { ModelService } from '../services/model.service';

@Component({
  selector: 'app-model-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="polas-section" *ngIf="model">
      <div class="polas-inner">
        <button class="close-polas" (click)="close.emit()">&times;</button>

        <div class="polas-header">
          <div class="polas-name">{{ model.name }}</div>

          <div class="polas-measures">
            <span *ngIf="model.height">
              <span class="measure-label">Height</span>
              <span class="measure-value">{{ convert(model.height, true) }}</span>
            </span>
            <span *ngIf="model.measurements">
              <span class="measure-label">Measurements</span>
              <span class="measure-value">{{ convert(model.measurements) }}</span>
            </span>
            <span *ngIf="model.shoe">
              <span class="measure-label">Shoe</span>
              <span class="measure-value">{{ model.shoe }}</span>
            </span>

            <!-- Botón Descarga -->
            <a *ngIf="model.download" [href]="model.download" download class="download-btn">
              Download Book
            </a>
          </div>

          <div class="unit-toggle-wrap">
            <button (click)="toggleUnits()" class="toggle-unit-btn">
              Switch to {{ isMetric ? 'ft/in' : 'cm/m' }}
            </button>
          </div>
        </div>

        <!-- Galería Grid -->
        <div class="polas-gallery">
          <div *ngFor="let item of model.portfolio" class="pola-pic">
            <video *ngIf="modelService.isVideo(item)" [src]="item" controls muted playsinline></video>
            <img *ngIf="!modelService.isVideo(item)" [src]="item" loading="lazy">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .polas-section {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #181818;
      z-index: 5000;
      overflow-y: auto;
      animation: fadePolas 0.33s;
    }

    @keyframes fadePolas {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .polas-inner {
      max-width: 970px;
      margin: 40px auto;
      padding: 32px 10px 30px;
      background: rgba(0, 0, 0, 0.23);
      border-radius: 18px;
      box-shadow: 0 10px 60px rgba(0, 0, 0, 0.65);
      min-height: 80vh;
      position: relative;
    }

    .polas-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 26px;
    }

    .polas-name {
      font-size: 2rem;
      font-weight: 700;
      color: #ff0000;
      text-align: center;
      letter-spacing: 1.5px;
      margin-bottom: 15px;
    }

    .polas-measures {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
      font-size: 0.9rem;
      color: #fff;
      margin-bottom: 14px;
    }

    .measure-label {
      color: #ff0000;
      font-weight: 500;
      margin-right: 5px;
    }

    .measure-value {
      color: #fff;
    }

    .download-btn {
      background: #1c1e1f;
      color: #fff;
      border: 1px solid #ff0000;
      padding: 6px 15px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .download-btn:hover {
      background: #2a2a2a;
      color: #fff;
    }

    .unit-toggle-wrap {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }

    .toggle-unit-btn {
      padding: 7px 20px;
      font-size: 0.93rem;
      background: #1c1e1f;
      color: #bababa;
      border: 1px solid #bababa;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s ease;
      font-family: "IBM Plex Mono", monospace;
    }

    .toggle-unit-btn:hover {
      color: #fff;
      border-color: #fff;
      background: #2a2a2a;
    }

    .polas-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 14px;
      margin-bottom: 37px;
      width: 100%;
    }

    .pola-pic {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      aspect-ratio: 3/4;
      width: 100%;
      position: relative;
    }

    .pola-pic img,
    .pola-pic video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0;
      display: block;
    }

    .close-polas {
      position: absolute;
      right: 30px;
      top: 20px;
      font-size: 3rem;
      background: none;
      border: none;
      color: #ff0000;
      cursor: pointer;
      font-weight: bold;
      line-height: 1;
      transition: transform 0.18s;
      z-index: 222;
    }

    .close-polas:hover {
      transform: scale(1.18);
    }

    @media (max-width: 600px) {
      .polas-inner {
        margin: 8vw 0 5vw;
        padding: 10vw 5vw;
      }
      .close-polas {
        top: 5px;
        right: 8px;
        font-size: 2.2rem;
      }
    }
  `]
})
export class ModelDetailComponent {
  @Input() model!: Model;
  @Output() close = new EventEmitter<void>();

  isMetric = true;

  constructor(public modelService: ModelService) {}

  toggleUnits() {
    this.isMetric = !this.isMetric;
  }

  convert(text: string, isHeight = false): string {
    if (this.isMetric) return text;

    // Conversión a sistema imperial
    return text.replace(/(\d+(?:\.\d+)?)cm/gi, (_, val) => {
      const inches = (parseFloat(val) / 2.54).toFixed(1);
      return `${inches}"`;
    }).replace(/(\d+(?:\.\d+)?)m\b/gi, (_, val) => {
       const cm = parseFloat(val) * 100;
       const totalInches = cm / 2.54;
       const feet = Math.floor(totalInches / 12);
       const inches = Math.round(totalInches % 12);
       return `${feet}'${inches}"`;
    });
  }
}

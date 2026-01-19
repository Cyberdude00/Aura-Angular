import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Model } from '../models/model.interface';
import { ModelService } from '../services/model.service';

@Component({
  selector: 'app-model-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" (click)="select.emit(model)">
      <div class="card-media-wrapper" [class.unavailable]="model.availability === 'off'">
        <img
          *ngIf="!modelService.isVideo(model.photo)"
          [src]="model.photo"
          [alt]="model.name"
          loading="lazy">
        <video
          *ngIf="modelService.isVideo(model.photo)"
          [src]="model.photo"
          muted
          autoplay
          loop
          playsinline>
        </video>
        <div *ngIf="model.availability === 'off'" class="unavailable-overlay">
          Ongoing Trip
        </div>
      </div>
      <div class="card-body">{{ model.name }}</div>
    </div>
  `,
  styles: [`
    .card {
      background: #323232;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 280px;
      cursor: pointer;
      transition: box-shadow 0.16s;
      overflow: hidden;
      padding: 0;
    }

    .card-media-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 3/4;
      overflow: hidden;
      background: #232323;
    }

    .card-media-wrapper img,
    .card-media-wrapper video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: grayscale(14%) brightness(1.02);
      transition: filter 0.21s;
    }

    .card-media-wrapper.unavailable {
      position: relative;
    }

    .unavailable-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 0.9rem;
      pointer-events: none;
    }

    .card-body {
      padding: 15px 0;
      text-align: center;
      letter-spacing: 0.5px;
      font-size: 1.05rem;
      font-weight: 200;
      color: #bababa;
      margin: 0;
      border: none;
    }

    .card:hover {
      box-shadow: 0 8px 38px rgba(0, 0, 0, 0.4);
    }

    .card:hover .card-media-wrapper img,
    .card:hover .card-media-wrapper video {
      filter: grayscale(0%) brightness(1.08);
    }
  `]
})
export class ModelCardComponent {
  @Input() model!: Model;
  @Output() select = new EventEmitter<Model>();

  constructor(public modelService: ModelService) {}
}

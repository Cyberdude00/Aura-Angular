import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Model } from '../model';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-gallery-view',
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.css']
})
export class GalleryViewComponent implements OnInit {

  models$: Observable<Model[]>;

  // State for Modals
  selectedModel: Model | null = null;
  
  // State for Image Viewer (Lightbox)
  currentImage: string | null = null;
  currentPortfolio: string[] = [];
  currentIndex: number = 0;
  isCurrentMediaVideo: boolean = false;

  constructor(private galleryService: GalleryService) {
    this.models$ = this.galleryService.models$;
  }

  ngOnInit(): void {
    // Data is loaded automatically by the service
  }

  // --- Polas (Model Detail) Modal Logic ---

  openPolas(model: Model): void {
    this.selectedModel = model;
    // Add a class to the body to prevent scrolling, similar to the original script
    document.body.style.overflow = 'hidden';
  }

  closePolas(): void {
    this.selectedModel = null;
    document.body.style.overflow = 'auto';
  }

  // --- Image Viewer (Lightbox) Logic ---

  openImageViewer(portfolio: string[], index: number): void {
    this.currentPortfolio = portfolio;
    this.currentIndex = index;
    this.updateImageViewer();
  }

  closeImageViewer(): void {
    this.currentImage = null;
    this.currentPortfolio = [];
  }
  
  navigateImageViewer(direction: number): void {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.currentPortfolio.length) {
      this.currentIndex = newIndex;
      this.updateImageViewer();
    }
  }

  private updateImageViewer(): void {
    const url = this.currentPortfolio[this.currentIndex];
    this.currentImage = url;
    this.isCurrentMediaVideo = /\.(mp4|webm|mov)$/i.test(url);
    this.preloadAdjacentImages();
  }
  
  private preloadAdjacentImages(): void {
    const prevIndex = this.currentIndex - 1;
    const nextIndex = this.currentIndex + 1;

    if (this.currentPortfolio[prevIndex] && !/\.(mp4|webm|mov)$/i.test(this.currentPortfolio[prevIndex])) {
      const img = new Image();
      img.src = this.currentPortfolio[prevIndex];
    }
    if (this.currentPortfolio[nextIndex] && !/\.(mp4|webm|mov)$/i.test(this.currentPortfolio[nextIndex])) {
      const img = new Image();
      img.src = this.currentPortfolio[nextIndex];
    }
  }
  
  // --- Keyboard Event Handling ---

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.currentImage) { // Image viewer is open
      if (event.key === 'Escape') {
        this.closeImageViewer();
      }
      if (event.key === 'ArrowRight') {
        this.navigateImageViewer(1);
      }
      if (event.key === 'ArrowLeft') {
        this.navigateImageViewer(-1);
      }
    } else if (this.selectedModel) { // Polas modal is open
      if (event.key === 'Escape') {
        this.closePolas();
      }
    }
  }
}

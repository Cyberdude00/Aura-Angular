import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  title = 'Aura Scouting';
  showCookieBanner = false;

  ngOnInit() {
    // Verificar si ya se aceptaron las cookies (solo en el navegador)
    if (typeof window !== 'undefined' && localStorage) {
      if (!localStorage.getItem('cookieAccepted')) {
        this.showCookieBanner = true;
      }
    }
  }

  acceptCookies() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('cookieAccepted', 'true');
      this.showCookieBanner = false;
    }
  }
}

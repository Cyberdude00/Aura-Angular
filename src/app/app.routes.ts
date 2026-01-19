import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: 'Aura Scouting'
  },
  {
    path: 'selection/:region',
    loadComponent: () => import('./features/gallery/components/selection.component').then(m => m.SelectionComponent),
    title: 'Model Selection'
  }
];

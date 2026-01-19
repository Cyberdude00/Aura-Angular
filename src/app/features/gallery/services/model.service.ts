import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Model } from '../models/model.interface';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor(private http: HttpClient) {}

  getModelsByRegion(region: string): Observable<Model[]> {
    // Angular busca en la carpeta 'src/assets' cuando usas '/assets'
    return this.http.get<Model[]>(`/assets/data/${region}.json`);
  }

  // Utilidad para saber si es video (usada en los componentes)
  isVideo(url: string): boolean {
    return /\.(mp4|webm|mov)$/i.test(url);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Model } from './model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private modelsUrl = 'assets/gallery/models.json';
  private modelsSubject = new BehaviorSubject<Model[]>([]);
  models$: Observable<Model[]> = this.modelsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.http.get<Model[]>(this.modelsUrl).pipe(
      tap(data => this.modelsSubject.next(data)),
      catchError(error => {
        console.error('Error loading models data:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    ).subscribe();
  }

  // NOTE: All the following methods (add, update, delete) operate on an in-memory array.
  // For a real application, these would make HTTP requests to a backend API to persist the changes.

  addModel(model: Omit<Model, 'id'>): Observable<Model> {
    const currentModels = this.modelsSubject.getValue();
    const newId = Math.max(...currentModels.map(m => m.id), 0) + 1;
    const newModel: Model = { ...model, id: newId };
    
    this.modelsSubject.next([...currentModels, newModel]);
    
    // Simulate an HTTP response
    return of(newModel);
  }

  updateModel(modelToUpdate: Model): Observable<Model> {
    const currentModels = this.modelsSubject.getValue();
    const updatedModels = currentModels.map(m => m.id === modelToUpdate.id ? modelToUpdate : m);
    
    this.modelsSubject.next(updatedModels);

    // Simulate an HTTP response
    return of(modelToUpdate);
  }

  deleteModel(modelId: number): Observable<{}> {
    const currentModels = this.modelsSubject.getValue();
    const updatedModels = currentModels.filter(m => m.id !== modelId);

    this.modelsSubject.next(updatedModels);

    // Simulate an HTTP response
    return of({});
  }
}

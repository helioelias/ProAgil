import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Palestrante } from '../_models/Palestrante';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PalestranteService {
  
  
  baseURL = 'http://localhost:5000/Palestrante';
  
  
  constructor(private http:  HttpClient) { }
  
  getPalestranteById(id: number) : Observable<Palestrante> {
    return this.http.get<Palestrante>(`${this.baseURL}/${id}`);
  }

  getAll() {
    return this.http.get<Palestrante[]>(`${this.baseURL}`);
  }
  
  postUpload(file: File, name: string) {
    const fileToUpload = <File>file[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, name);
    console.log(name);
    return this.http.post(`${this.baseURL}/upload`, formData);
  }
  
  postPalestrante(Palestrante: Palestrante) {
    return this.http.post(this.baseURL, Palestrante);
  }
  
  updatePalestrante(Palestrante: Palestrante) {
    return this.http.put(`${this.baseURL}/${Palestrante.id}`, Palestrante);
  }
  
  deletePalestrante(id: number) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }
  
}

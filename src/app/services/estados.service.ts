import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Estado } from '../models/estado';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {
  public url = "http://localhost:8080";
  
  constructor(private http:HttpClient) {
    
   }

  crearEstado(estado:Estado){
    return 
  }
}

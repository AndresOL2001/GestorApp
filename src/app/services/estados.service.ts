import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Estado } from '../models/estado';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {
 //public url = environment.url; 
 public url = "http://localhost:8080/api";
  
  constructor(private http:HttpClient) {
    
   }

  obtenerEstados(){
    return this.http.get(this.url+`/estado`);
  }

  crearEstado(estado:Estado){
    return this.http.post(this.url+`/estado`,estado);
  }

  eliminarEstado(id:number){
    return this.http.delete(this.url+`/estado/${id}`);

  }

  actualizarEstado(estado:Estado){
    return this.http.post(this.url+`/estado`,estado);
  }

  obtenerEstadoPorId(id:number){
    return this.http.get(this.url+`/estado/${id}`);
  }
}

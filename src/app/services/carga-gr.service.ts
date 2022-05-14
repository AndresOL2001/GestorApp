import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargaGrService {

  constructor(private http:HttpClient) { }

  public url = "http://localhost:8080";
  getCargas(){
    return this.http.get(this.url+`/cargaGr`);
  }
}

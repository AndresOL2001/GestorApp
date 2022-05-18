import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargaGrService {

  constructor(private http:HttpClient) { }

  public url = "https://gestoria-aventura.herokuapp.com";
  getCargas(){
    return this.http.get(this.url+`/cargaGr`);
  }

  postCargas(file){
    let header = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });
  
    let fd = new FormData();
    fd.append("file", file);
    
   
    return this.http.post(this.url+`/cargaGr`,fd);
  }

  postCargasCSV(file){
    let header = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });
   
    let fd = new FormData();
    fd.append("file", file);
    
   
    return this.http.post(this.url+`/cargaGr/csv`,fd);
  }
}

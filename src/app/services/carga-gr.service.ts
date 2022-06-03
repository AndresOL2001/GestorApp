import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cargaGr, cargaGrExp } from '../models/cargaGr';
import { DatePipe } from '@angular/common';
import { Comentario } from '../models/comentario';
import { CargaGrConDetalle } from '../models/cargaGrConDetalle';
import { cargaGrIds } from '../models/cargaGrIds';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CargaGrService {

  constructor(private http:HttpClient,private datePipe:DatePipe) { }

  //public url = environment.url; 
  public url = "http://localhost:8080/api";

  cargasGr:cargaGrExp[] = [];
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

  exportarCargas(cargasGrAux:cargaGr[]){

    cargasGrAux.forEach(carga => {
     let cargaGr:cargaGrExp ={
      id:carga.id,
    fechaAsignacion:this.datePipe.transform(carga.fecha_asignacion,'yyyy-MM-dd'),
    siniestro:carga.siniestro,
    origen:carga.origen,
    niu:carga.niu,
    ov:carga.ov,
    personalizada:carga.personalizada,
    nombre:carga.nombre,
    correo:carga.correo,
    telefono1:carga.telefono1,
    telefono2:carga.telefono2,
    marca:carga.marca,
    modelo:carga.modelo,
    año:carga.año,
    serie:carga.serie,
    observaciones:carga.observaciones,
    estado:carga.nombreestado,
    proveedor:carga.proveedor
    
     }
     console.log(cargaGr.fechaAsignacion);
     this.cargasGr.push(cargaGr);
    });
    
    return this.http.post(this.url+`/cargaGr/exportar`,this.cargasGr,{ responseType: 'blob'} );
  }


  exportarCargaEspecifica(cargaAux:CargaGrConDetalle){
    
    return this.http.post(this.url+`/cargaGr/exportarEspecifica`,cargaAux,{ responseType: 'blob'} );
  }

  actualizarCarga(idCarga:string,idEstado:number,proveedor:string){
    return this.http.post(this.url+`/cargaGr/actualizar/${idCarga}/${idEstado}`,proveedor );

  }

  buscarTodo(valor:string){
    return this.http.get(this.url+`/cargaGr/buscar/${valor}`);

  }

  borrarCargas(firstNameIds){
   
    return this.http.delete(this.url+`/cargaGr/${firstNameIds}`);
  }

 //apartado comentarios
 crearComentario(comentario:Comentario,id:number){
  return this.http.post(this.url+`/cargaGr/crearComentario/${id}`,comentario);
}

getComentarios(id:string){
  return this.http.get(this.url+`/cargaGr/comentarios/${id}`);
}

  eliminarComentario(id:number){
    return this.http.delete(this.url+`/cargaGr/comentario/${id}`)
  }

  actualizarComentario(id:number,contenido:string){
    return this.http.put(this.url+`/cargaGr/comentario/${id}`,contenido);
  }

}

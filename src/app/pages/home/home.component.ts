import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { LinkedList } from 'src/app/Helpers/LinkedListEstados';
import { cargaGr } from 'src/app/models/cargaGr';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import { NavbarService } from 'src/app/services/navbar.service';
import * as ClassicEditor from '../../../../ckeditor/build/ckEditor';
import { Comentario, CargaComentario, EstadoComentario } from '../../models/comentario';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  comentarios:any[] = [];

  public editor: any = ClassicEditor;
  cajaDescripcionComentario = " ";
  checkboxRef;
  cargasGr: cargaGr[];
  cargasView:any[];
  numeroTotalDePaginas: number;
  registrosPorPagina = 5;
  pageSizes = [5, 10, 15, 20, 30, 40, 50];
  page: number;
  pageHeaders = [
    'SINIESTRO',
    'ESTADO',
    'ORIGEN',
    'NIU',
    'OV',
    'PERSONALIZADA',
    'NOMBRE',
    'CORREO',
    'TELEFONO1',
    'TELEFONO2',
    'MARCA',
    'MODELO',
    'AÑO',
    'SERIE',
    'OBSERVACIONES',
  ];
  FiltroEstado;
  FiltroFecha;
  EstadoActual = "NORMAL";
  EstadoFecha= "NORMAL"
  lastYearFormat;
  lastMonthFormat;
  lastWeekFormat;
  todayFormat;
  banderaModal = false;
  cargaModal:cargaGr;
listaEstados = new LinkedList();

  constructor(
    private cargaService: CargaGrService,
    private nav: NavbarService,
    private datePipe:DatePipe
  ) {}
 

  ngOnInit(): void {
    this.FiltroEstado = 'Estado';
    this.FiltroFecha = 'Fecha';
    this.nav.show();
    this.InicializarFechas();
    this.listaEstados.append("Estado");
    this.listaEstados.append("Creado");
    this.listaEstados.append("Asignado");
    this.listaEstados.append("Notificado");
    this.listaEstados.append("Localizado");
    this.listaEstados.append("Validacion Digital");
    this.listaEstados.append("Gestoria en tramite");
    this.listaEstados.append("Documentos Entregados");



    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      this.cargasGr = resp;
      this.cargasView = resp;
      this.obtenerTotalIndicesTabla();
      console.log(resp);
    });

  }


  obtenerTotalIndicesTabla() {
    this.numeroTotalDePaginas = this.cargasGr.length / 5;

    if (this.numeroTotalDePaginas % 1 == 0) {
      this.numeroTotalDePaginas = Math.trunc(this.numeroTotalDePaginas);
    } else {
      this.numeroTotalDePaginas = Math.trunc(this.numeroTotalDePaginas) + 1;
    }
  }

  ordenarAlfabeticamente(head: string) {
    const switchFecha = {
      "Este Año":this.lastYearFormat,
      "Esta Semana":this.lastWeekFormat,
      "Este Mes":this.lastMonthFormat,
      "Hoy":this.todayFormat
    }
    console.log(this.FiltroEstado);

    if(head == 'ESTADO'){
    
      head = 'nombreestado'
    }

    if (this.EstadoActual == "NORMAL") {

      
      this.EstadoActual ="ASCENDENTE";
     
      
      this.cargasGr.sort(function (a, b) {
      
        if (a[head.toLowerCase()] > b[head.toLowerCase()]) {
          return 1;
        }
        if (a[head.toLowerCase()] < b[head.toLowerCase()]) {
          return -1;
        }
        return 0;
      });

      if(this.FiltroEstado != 'Estado'){
        this.cargasGr.filter(x=>x.nombreestado == this.FiltroEstado);
      }

      if(this.FiltroFecha != 'Fecha'){
        this.cargasGr.filter(x=>x.fecha_asignacion > switchFecha[this.FiltroFecha]);
      }
     // console.log(this.EstadoActual);
      
    }else if(this.EstadoActual == "ASCENDENTE"){
    
      //console.log("entraste aqui")
  
      this.cargasGr.sort(function (a, b) {

        if (a[head.toLowerCase()] < b[head.toLowerCase()]) {
          return 1;
        }
        if (a[head.toLowerCase()] > b[head.toLowerCase()]) {
          return -1;
        }
        return 0;
      });
      this.EstadoActual = "DESCENDENTE";

      if(this.FiltroEstado != 'Estado'){
        this.cargasGr.filter(x=>x.nombreestado == this.FiltroEstado);
      }

      if(this.FiltroFecha != 'Fecha'){
        this.cargasGr.filter(x=>x.fecha_asignacion > switchFecha[this.FiltroFecha]);
      }

    }else{
     
      this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
        this.cargasView = resp;
        if(this.FiltroFecha != 'Fecha' && this.FiltroEstado != 'Estado'){
          this.cargasGr.filter(x=>x.fecha_asignacion > switchFecha[this.FiltroFecha] && x.nombreestado == this.FiltroEstado);
        }else if(this.FiltroFecha != 'Fecha'){
          this.cargasGr = this.cargasView.filter(x=>x.fecha_asignacion > switchFecha[this.FiltroFecha]);

        }else if(this.FiltroEstado != 'Estado'){
          this.cargasGr = this.cargasView.filter(x=>x.nombreestado == this.FiltroEstado);
        }else{
          this.cargasGr = resp;
        }
       // this.obtenerTotalIndicesTabla();
      });
      this.EstadoActual = "NORMAL";
      
    }
  }

  ordenarFecha() {
    const switchFecha = {
      "Este Año":this.lastYearFormat,
      "Esta Semana":this.lastWeekFormat,
      "Este Mes":this.lastMonthFormat,
      "Hoy":this.todayFormat
    }
    console.log('lol'+this.FiltroEstado);

    if(this.EstadoFecha == "NORMAL"){
      this.cargasGr.sort(
        (a, b) => Date.parse(b.fecha_asignacion) - Date.parse(a.fecha_asignacion)
      );
      this.EstadoFecha = "ASCENDENTE";
      if(this.FiltroEstado != 'Estado'){
        this.cargasGr.filter(x=>x.nombreestado == this.FiltroEstado);
      }
 
    }else if (this.EstadoFecha == "ASCENDENTE"){
      this.cargasGr.sort(
        (a, b) => Date.parse(a.fecha_asignacion) - Date.parse(b.fecha_asignacion)
      );
      this.EstadoFecha = "DESCENDENTE";
      if(this.FiltroEstado != 'Estado'){
        this.cargasGr.filter(x=>x.nombreestado == this.FiltroEstado);
      }
    
    }else{
      this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
        this.cargasView = resp;

        if(this.FiltroFecha != 'Fecha'){
          
      

          if(this.EstadoFecha != "Hoy"){
            console.log("ENTRASTE AQUI AÑO")
            this.cargasGr.filter(x=>x.fecha_asignacion > switchFecha[this.EstadoFecha]);

          }else{
            this.cargasGr.filter(x=>x.fecha_asignacion == switchFecha[this.EstadoFecha]);

          }

        }

        if(this.FiltroEstado != 'Estado' ){
          this.cargasGr = this.cargasView.filter(x=>x.nombreestado == this.FiltroEstado);
        }

        if(this.FiltroEstado == 'Estado' && this.FiltroFecha == 'Fecha'){
          console.log("uwuwuwu")
          this.cargasGr = resp;
        }
       // this.obtenerTotalIndicesTabla();
      });
      this.EstadoFecha = "NORMAL";
  
    }
   
  }


  cambioFiltroEstado(event){

    const switchFecha = {
      "Este Año":this.lastYearFormat,
      "Esta Semana":this.lastWeekFormat,
      "Este Mes":this.lastMonthFormat,
      "Hoy":this.todayFormat
    }

    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      this.cargasView = resp;
    });

    if(event == 'Estado'){
    

        if(this.FiltroFecha != 'Fecha'){

          if(this.FiltroFecha != "Hoy"){
            this.cargasGr = this.cargasView.filter(x=>x.fecha_asignacion > switchFecha[this.EstadoFecha]);

          }else{
            this.cargasGr = this.cargasView.filter(x=>x.fecha_asignacion == switchFecha[this.EstadoFecha]);

          }

        }

       // this.obtenerTotalIndicesTabla();
       
   
    }else {
      if(this.FiltroFecha != 'Fecha'){

        if(this.FiltroFecha != "Hoy"){

          this.cargasGr = this.cargasView.filter(x=>x.fecha_asignacion > switchFecha[this.FiltroFecha] && x.nombreestado == this.FiltroEstado);
  
        }else{
          this.cargasGr = this.cargasView.filter(x=>x.fecha_asignacion == switchFecha[this.FiltroFecha] && x.nombreestado == this.FiltroEstado);
  
        }
  
      }else{
        this.cargasGr = this.cargasView.filter(x=> x.nombreestado == this.FiltroEstado);
      }

    }

    
    
  }

  cambioFiltroFecha(event){

    if(event == 'Fecha'){
       this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
        this.cargasGr = resp;
        this.cargasView = resp;
        if(this.FiltroEstado != 'Estado'){
          this.cargasGr = this.cargasView.filter(x=> x.nombreestado == this.FiltroEstado);

        }
       // this.obtenerTotalIndicesTabla();
      }); 
   
    }else if(event == 'Este Año'){

      if(this.FiltroEstado != 'Estado'){
        this.cargasGr = this.cargasView.filter(x=> x.fecha_asignacion > this.lastYearFormat && x.nombreestado == this.FiltroEstado);
      }else{
        console.log("uwuuwuwuwu")
      this.cargasGr = this.cargasView.filter(x=> x.fecha_asignacion > this.lastYearFormat);

      }
      
    }else if(event == 'Este Mes'){

      if(this.FiltroEstado != 'Estado'){
        this.cargasGr = this.cargasView.filter(x=> x.fecha_asignacion > this.lastMonthFormat && x.nombreestado == this.FiltroEstado);
      }else{
      this.cargasGr = this.cargasView.filter(x=> x.fecha_asignacion > this.lastMonthFormat);
      }

    }else if(event == 'Esta Semana'){
      console.log(event);

      if(this.FiltroEstado != 'Estado'){
        this.cargasGr = this.cargasView.filter(x=> x.fecha_asignacion > this.lastWeekFormat && x.nombreestado == this.FiltroEstado);
      }else{
      this.cargasGr = this.cargasView.filter(x=> x.fecha_asignacion > this.lastWeekFormat);
      }


    }else{

      if(this.FiltroEstado != 'Estado'){
        this.cargasGr = this.cargasView.filter(x=> x.fecha_asignacion == this.todayFormat && x.nombreestado == this.FiltroEstado);
      }else{
      this.cargasGr = this.cargasView.filter(x=> x.fecha_asignacion == this.todayFormat);
      }

    }

        
  }

  InicializarFechas(){
    
    let today = new Date();
    this.todayFormat = this.datePipe.transform(today,"yyyy-MM-dd");
    today.setDate(today.getDate() - 6);
    this.lastWeekFormat = this.datePipe.transform(today,"yyyy-MM-dd");
    today.setDate(today.getDate() - 23);
    this.lastMonthFormat = this.datePipe.transform(today,"yyyy-MM-dd");
    today.setDate(today.getDate() - 335);
    this.lastYearFormat = this.datePipe.transform(today,"yyyy-MM-dd");

  }

  abrirModal(checkbox,carga:cargaGr){
    // checkbox.style.transition = 'all .2s ease' ;
    this.checkboxRef = checkbox;
    if(checkbox.checked){
    this.banderaModal= true;
    }else{
    this.banderaModal = false;
  }

  this.cargaModal = carga;
  console.log(this.cargaModal.id);
  this.cargaService.getComentarios(this.cargaModal.id).subscribe( (resp:any) => {
    this.comentarios = resp;
  },err => {
    this.comentarios = [];
    if(this.comentarios.length == 0){
      this.crearComentario("Registro importado correctamente y registrado con estatus de CREADO.");
    }
  })

}


CerrarModal(){
  this.checkboxRef.checked = false;
  this.banderaModal = false;

}

exportarCargas(cargasGr){
 
  this.cargaService.exportarCargas(cargasGr).subscribe(resp => {
    const blob = new Blob([resp], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    //const url= window.URL.createObjectURL(blob);
  //window.open(url);
  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  let date = new Date();
  let dateFormat = this.datePipe.transform(date,"yyyy-MM-dd");
 // console.log(`${date.getFullYear()} - ${date.getMonth()} - ${date.getDay()} / cargaGr`);
link.download = `${dateFormat} / cargaGr`;

  link.click();
  })

}

crearComentario(comentarioDescripcion:string){
  comentarioDescripcion= comentarioDescripcion.replace( /(<([^>]+)>)/ig, '');

  let cargasId:CargaComentario[] = [];
  
  let cargaId:CargaComentario = {
    id:this.cargaModal.id
  };
  cargasId.push(cargaId);

  let comentario:Comentario = {
    comentario:comentarioDescripcion,
    cargas:cargasId,
  }

 let id = 0;

  this.cargaService.crearComentario(comentario,5).subscribe( resp => {
    console.log(resp);
    this.actualizarComentarios();
  })


}

actualizarComentarios(){
  
  this.cargaService.getComentarios(this.cargaModal.id).subscribe( (resp:any) => {
    console.log('Entraste aqui');
    this.comentarios = resp;
  })
}

}

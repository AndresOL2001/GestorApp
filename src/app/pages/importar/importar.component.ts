import { Component, OnInit } from '@angular/core';
import { CargaGrService } from '../../services/carga-gr.service';
import * as ClassicEditor from '../../../../ckeditor/build/ckEditor';
import { NavbarService } from 'src/app/services/navbar.service';
import { cargaGr } from 'src/app/models/cargaGr';
import { DatePipe } from '@angular/common';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class ImportarComponent implements OnInit {
  public editor:any = ClassicEditor;
  banderaArchivoCargado= false;
  file:any;
  fileName:any;
  size:any;
  dispararAlerta=false;
  dispararAlertaError=false;
  errorMensaje:string;
  cargasGr:cargaGr[];
  cargasView:cargaGr[];
  abrirFooter=false;
  mostrarAvisoRegistros: boolean;
  mostrarMensajeInicial:boolean;
  registrosPorPagina = 5;
  //Fechas
  lastYearFormat;
  lastMonthFormat;
  lastWeekFormat;
  todayFormat;

  //Filtros
  EstadoActual
  EstadoFecha

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
    'PROVEEDOR'
  ];
  espereUnMomento = false;
  pageSizes = [5, 10, 15, 20, 30, 40, 50];

  constructor(private cargaGrService:CargaGrService,private nav:NavbarService,private datePipe:DatePipe) { }

  primeraVez:boolean = false;
  ngOnInit(): void {
    if(localStorage.getItem('FirstTime')){
      this.primeraVez = false;
    }else{
      this.primeraVez = true;
    }
    this.EstadoFecha = 'NORMAL';
    this.EstadoActual = 'NORMAL';
    this.nav.show();

    this.cargaGrService.getCargas().subscribe((resp: cargaGr[]) => {
      resp = resp.filter(carga => carga.nombreestado == 'Creado');
      resp.forEach((carga,i) => {
        carga.index = i+1;
      })
      // console.log(resp);
      this.cargasGr = resp;
      this.cargasView = resp;
      this.primeraVez = false;
       if(this.cargasGr.length>0){
      //  this.mostrarAvisoRegistros = true;
      } 
    
    }); 
  }

  ordenarAlfabeticamente(head: string) {
  
    if (head == 'ESTADO') {
      head = 'nombreestado';
    }

    if(head == '#'){
      head = 'index';
    }

    if (this.EstadoActual == 'NORMAL') {
      this.EstadoActual = 'ASCENDENTE';

      this.cargasGr.sort(function (a, b) {
        if (a[head.toLowerCase()] > b[head.toLowerCase()]) {
          return 1;
        }
        if (a[head.toLowerCase()] < b[head.toLowerCase()]) {
          return -1;
        }
        return 0;
      });


      // console.log(this.EstadoActual);
    } else if (this.EstadoActual == 'ASCENDENTE') {
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
      this.EstadoActual = 'DESCENDENTE';


    } else {
      this.cargaGrService.getCargas().subscribe((resp: cargaGr[]) => {
        resp = resp.filter(carga => carga.nombreestado == 'Creado');
        resp.forEach((carga,i) => {
          carga.index = i+1;
        })

        this.cargasView = resp;
       
          this.cargasGr = resp;
      
        // this.obtenerTotalIndicesTabla();
      });
      this.EstadoActual = 'NORMAL';
    }
  }

  ordenarFecha() {
   

    if (this.EstadoFecha == 'NORMAL') {
      this.cargasGr.sort(
        (a, b) =>
          Date.parse(b.fecha_asignacion) - Date.parse(a.fecha_asignacion)
      );
      this.EstadoFecha = 'ASCENDENTE';
 
    } else if (this.EstadoFecha == 'ASCENDENTE') {
      this.cargasGr.sort(
        (a, b) =>
          Date.parse(a.fecha_asignacion) - Date.parse(b.fecha_asignacion)
      );
      this.EstadoFecha = 'DESCENDENTE';
   
    } else {
      this.cargaGrService.getCargas().subscribe((resp: cargaGr[]) => {
        resp = resp.filter(carga => carga.nombreestado == 'Creado');
        resp.forEach((carga,i) => {
          carga.index = i+1;
        })
        this.cargasView = resp;
        this.cargasGr = resp;
        // this.obtenerTotalIndicesTabla();
      });
      this.EstadoFecha = 'NORMAL';
    }
  }

  buscar(termino: string) {
    //console.log(termino);

    this.cargaGrService.buscarTodo(termino).subscribe((resp: cargaGr[]) => {
      resp = resp.filter(x=> x.nombreestado == 'Creado');
      resp.forEach((carga,i) => {
        carga.index = i+1;
      })
      this.cargasGr = resp;
    });
  }

  

  onFileSelected(event){
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.banderaArchivoCargado=true;
       this.fileName = this.file.name;
       this.size = this.file.size;
       this.abrirFooter = true;
    }
  }

  cancelarLayout(){
    this.banderaArchivoCargado=false;
    this.file = null;
    this.abrirFooter = false;
  }


  cantidadRegistrosImportados:number;
  cargarLayout(file){

    let extension = this.fileName.substring(this.fileName.lastIndexOf('.')+1, this.fileName.length);
    if(extension == 'xlsx'){
      this.espereUnMomento = true;
      this.cargaGrService.postCargas(file).subscribe( (resp:any) => {
        this.cantidadRegistrosImportados = resp.length;
        this.espereUnMomento = false;
        this.mostrarAvisoRegistros = true;
  
      
      setTimeout(() => {
        let registrosAlert = document.getElementById("registrosAlerta2");
        registrosAlert.classList.add("fade-in2")
       setTimeout(() => {
         this.mostrarAvisoRegistros = false;
       },1500)
      },2000)  
    
        this.dispararAlerta=true;
        this.dispararAlertaError=false;
        this.cargaGrService.getCargas().subscribe( (resp:cargaGr[]) => {
          resp = resp.filter(carga => carga.nombreestado == 'Creado');
          resp.forEach((carga,i) => {
            carga.index = i+1;
          })
          this.cargasGr = resp;
          this.cargasView = resp;
          localStorage.setItem("FirstTime",'true');
        })
        this.cancelarLayout();
      },err=>{
        this.dispararAlertaError=true;
        this.errorMensaje = err.error.mensaje;
      })
    }else if(extension == 'csv'){
      this.espereUnMomento =true;
      this.cargaGrService.postCargasCSV(file).subscribe((resp:any) => {
        this.cantidadRegistrosImportados = resp.length;
        this.espereUnMomento = false;
        this.mostrarAvisoRegistros = true;  
      
       setTimeout(() => {
         let registrosAlert = document.getElementById("registrosAlerta2");
         registrosAlert.classList.add("fade-in2")
        setTimeout(() => {
          this.mostrarAvisoRegistros = false;
        },1500)
       },2000)  

        this.dispararAlerta=true;
        this.cancelarLayout();
        this.cargaGrService.getCargas().subscribe( (resp:cargaGr[]) => {
          resp = resp.filter(carga => carga.nombreestado == 'Creado');
          resp.forEach((carga,i) => {
            carga.index = i+1;
          })
          this.cargasGr = resp;
          this.cargasView = resp;
          localStorage.setItem("FirstTime",'true');

        })
      },err=>{
        this.dispararAlertaError=true;
        this.errorMensaje = err.error.mensaje;
      })
    }else{
      this.dispararAlertaError=true;
      this.errorMensaje = "Cargue un archivo .csv o .xlsx";
      setTimeout(() => {
        let registrosAlert = document.getElementById("registrosAlertaError");
        registrosAlert.classList.add("fade-in2")
       setTimeout(() => {
         this.dispararAlertaError = false;
       },1500)
      },2000)  

      this.cancelarLayout();
    }
   
  }

  cerrarAlerta(){
    this.dispararAlerta = false;
    this.cancelarLayout();
  }

   //PAGINATIION
   public filter: string = '';
   public maxSize: number = 7;
   public directionLinks: boolean = true;
   public autoHide: boolean = false;
   public responsive: boolean = false;
   public config: PaginationInstance = {
       id: 'advanced',
       itemsPerPage: 5,
       currentPage: 1
   };
   public labels: any = {
       previousLabel: '<',
       nextLabel: '>',
       screenReaderPaginationLabel: 'Pagination',
       screenReaderPageLabel: 'page',
       screenReaderCurrentLabel: `You're on page`
   };
   public eventLog: string[] = [];
 
 
   onPageChange(number: number) {
       this.logEvent(`pageChange(${number})`);
       this.config.currentPage = number;
   }
 
   onPageBoundsCorrection(number: number) {
       this.logEvent(`pageBoundsCorrection(${number})`);
       this.config.currentPage = number;
   }
 
 
   private logEvent(message: string) {
       this.eventLog.unshift(`${new Date().toISOString()}: ${message}`)
   }
 
  }

import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { cargaGr } from 'src/app/models/cargaGr';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { DatePipe } from '@angular/common';
import { PaginationInstance } from 'ngx-pagination';


@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.css']
})
export class ExportarComponent implements OnInit {
  listaCargasIdsDelete=[];
  mensajeExito: string;
  dispararAlerta: boolean;

  constructor(private cargaService: CargaGrService, private navService: NavbarService, private datePipe: DatePipe) {   }
  selected:any;


  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>
  cargasGr;
  cargasView;
  registrosPorPagina = 5;
  pageSizes = [5, 10, 15, 20, 30, 40, 50];

  //Filtrados tabla
  FiltroEstado;
  FiltroFecha = {
    titulo:'Sin Fecha',
    imagen:'../../../assets/sinfecha.png'
  };
  EstadoActual = 'NORMAL';
  EstadoFecha = 'NORMAL';
/*   open = false;
 */  //Fechas
  lastYearFormat;
  lastMonthFormat;
  lastWeekFormat;
  todayFormat;

  //calendarioFecha
  desdeCalendar;
  hastaCalendar;
  banderaHastaFecha = false;

  //bandera
  mostrarCalendario = false;

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

  dropdownOptions = [
    {
      titulo:'Fecha',
      imagen:'../../../assets/sinfecha.png'
    },
    {
      titulo:'Hoy',
      imagen:'../../../assets/hoy.png'
    },
    {
      titulo:'Esta Semana',
      imagen:'../../../assets/semana.png'
    },
    {
      titulo:'Este Mes',
      imagen:'../../../assets/mes.png'
    },
    {
      titulo:'Personalizada',
      imagen:'../../../assets/personalizada.png'
    }

  ]

  dropdownOptionsEstados = [
    'Estado',
    'Creado',
    'Asignado',
    'Notificado',
    'Localizado',
    'Gestoria en tramite',
    'Validacion digital',
    'Documentos entregados'
  ]


  mostrarAvisoRegistros = false;
  mostrarMensajeInicial:boolean;
  abrirFooter = false;

  primeraVez:boolean = false;
  ngOnInit(): void {
    if(localStorage.getItem('FirstTime')){
      this.primeraVez = false;
    }else{
      this.primeraVez = true;
    }
    this.navService.show();
    window.addEventListener('click', function(e) {
      /*2. Si el div con id clickbox contiene a e. target*/
      if (document.getElementById('ulDrop').contains(e.target as HTMLElement)) {
        //console.log("dentro");
        document.getElementById('ulDrop2').style.cssText = "visibility:visible;"
      } else {
        //console.log("fuera");
        document.getElementById('ulDrop2').style.cssText = "visibility:hidden;"

      }
    })

    window.addEventListener('click', function(e) {
      if (document.getElementById('ulDrop3').contains(e.target as HTMLElement)) {
        //console.log("dentro");
        document.getElementById('ulDrop4').style.cssText = "visibility:visible;"
      } else {
        //console.log("fuera");
        document.getElementById('ulDrop4').style.cssText = "visibility:hidden;"

      }
    })


    this.mostrarMensajeInicial = true;
    this.FiltroEstado = 'Estado';
    this.FiltroFecha.titulo = this.dropdownOptions[0].titulo;
    this.InicializarFechas();

    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      resp.forEach(carga => carga.checked = false);
      resp.forEach((carga,i) => {
        carga.index = i+1;
      })
      this.cargasGr = resp;
      this.cargasView = resp;
      this.mostrarMensajeInicial = false;
      if(this.cargasGr.length>0){
        this.mostrarAvisoRegistros = true;
      } 
    });

    
  }

  count = 0;
  conteoIdsEliminar(){
    this.count = 0;
    this.cargasGr.forEach(item => {
      if (item['checked']) {
        this.count = this.count + 1;
      }
    })
    console.log(this.count);

    if(this.count >0){
      this.abrirFooter = true;
    }else{
      this.abrirFooter = false;
    }

  }

  cancelarEliminar() {
    this.checkboxes.forEach((element) => {
         element.nativeElement.checked = false;
});
}


  cancelarEliminarIds(){
    this.cancelarEliminar();
    this.abrirFooter = false;
  }

  cambioFiltroFecha(event) {
    if (event == 'Fecha') {
      this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
        resp.forEach(carga => carga.checked = false);
        resp.forEach((carga,i) => {
          carga.index = i+1;
        })
        this.cargasGr = resp;
        this.cargasView = resp;
        if (this.FiltroEstado != 'Estado') {
          this.cargasGr = this.cargasView.filter(
            (x) => x.nombreestado == this.FiltroEstado
          );
        }
        // this.obtenerTotalIndicesTabla();
      });
    } else if (event == 'Este Año') {
      if (this.FiltroEstado != 'Estado') {
        this.cargasGr = this.cargasView.filter(
          (x) =>
            x.fecha_asignacion > this.lastYearFormat &&
            x.nombreestado == this.FiltroEstado
        );
      } else {
        //console.log('uwuuwuwuwu');
        this.cargasGr = this.cargasView.filter(
          (x) => x.fecha_asignacion > this.lastYearFormat
        );
      }
    } else if (event == 'Este Mes') {
      if (this.FiltroEstado != 'Estado') {
        this.cargasGr = this.cargasView.filter(
          (x) =>
            x.fecha_asignacion > this.lastMonthFormat &&
            x.nombreestado == this.FiltroEstado
        );
      } else {
        this.cargasGr = this.cargasView.filter(
          (x) => x.fecha_asignacion > this.lastMonthFormat
        );
      }
    } else if (event == 'Esta Semana') {
      //console.log(event);

      if (this.FiltroEstado != 'Estado') {
        this.cargasGr = this.cargasView.filter(
          (x) =>
            x.fecha_asignacion > this.lastWeekFormat &&
            x.nombreestado == this.FiltroEstado
        );
      } else {
        this.cargasGr = this.cargasView.filter(
          (x) => x.fecha_asignacion > this.lastWeekFormat
        );
      }
    } else {
      if (this.FiltroEstado != 'Estado') {
        this.cargasGr = this.cargasView.filter(
          (x) =>
            x.fecha_asignacion == this.todayFormat &&
            x.nombreestado == this.FiltroEstado
        );
      } else {
        this.cargasGr = this.cargasView.filter(
          (x) => x.fecha_asignacion == this.todayFormat
        );
      }
    }
  }
  
  buscar(termino: string) {
/*     console.log(termino);
 */
    this.cargaService.buscarTodo(termino).subscribe((resp: any) => {
      resp.forEach(carga => carga.checked = false);
      resp.forEach((carga,i) => {
        carga.index = i+1;
      })
      this.cargasGr = resp;
    });
  }


  cambioFiltroEstado(event) {
    const switchFecha = {
      'Este Año': this.lastYearFormat,
      'Esta Semana': this.lastWeekFormat,
      'Este Mes': this.lastMonthFormat,
      Hoy: this.todayFormat,
    };

    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      resp.forEach(carga => carga.checked = false);
      resp.forEach((carga,i) => {
        carga.index = i+1;
      })
      this.cargasView = resp;
    });

    if (event == 'Estado') {
      if (this.FiltroFecha.titulo != 'Fecha') {
        if (this.FiltroFecha.titulo != 'Hoy') {
          this.cargasGr = this.cargasView.filter(
            (x) => x.fecha_asignacion > switchFecha[this.EstadoFecha]
          );
        } else {
          this.cargasGr = this.cargasView.filter(
            (x) => x.fecha_asignacion == switchFecha[this.EstadoFecha]
          );
        }
      }

      // this.obtenerTotalIndicesTabla();
    } else {
      if (this.FiltroFecha.titulo != 'Fecha') {
        if (this.FiltroFecha.titulo != 'Hoy') {
          this.cargasGr = this.cargasView.filter(
            (x) =>
              x.fecha_asignacion > switchFecha[this.FiltroFecha.titulo] &&
              x.nombreestado == this.FiltroEstado
          );
        } else {
          this.cargasGr = this.cargasView.filter(
            (x) =>
              x.fecha_asignacion == switchFecha[this.FiltroFecha.titulo] &&
              x.nombreestado == this.FiltroEstado
          );
        }
      } else {
        this.cargasGr = this.cargasView.filter(
          (x) => x.nombreestado == this.FiltroEstado
        );
      }
    }
  }


  exportarCargas(cargasGr) {
    this.mostrarMensajeInicial = true;
    this.cargaService.exportarCargas(cargasGr).subscribe((resp) => {
      const blob = new Blob([resp], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      //window.open(url);
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      let date = new Date();
      let dateFormat = this.datePipe.transform(date, 'yyyy-MM-dd');
      link.download = `${dateFormat} / cargaGr`;

      link.click();
      this.mostrarMensajeInicial = false;
      this.mensajeExito = "La exportacion se a realizado exitosamente"
      this.dispararAlerta = true;

    });
  }



  ordenarAlfabeticamente(head: string) {


    const switchFecha = {
      'Este Año': this.lastYearFormat,
      'Esta Semana': this.lastWeekFormat,
      'Este Mes': this.lastMonthFormat,
      Hoy: this.todayFormat,
    };
    //console.log(this.FiltroEstado);

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

      if (this.FiltroEstado != 'Estado') {
        this.cargasGr.filter((x) => x.nombreestado == this.FiltroEstado);
      }

      if (this.FiltroFecha.titulo != 'Fecha') {
        this.cargasGr.filter(
          (x) => x.fecha_asignacion > switchFecha[this.FiltroFecha.titulo]
        );
      }
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

      if (this.FiltroEstado != 'Estado') {
        this.cargasGr.filter((x) => x.nombreestado == this.FiltroEstado);
      }

      if (this.FiltroFecha.titulo != 'Fecha') {
        this.cargasGr.filter(
          (x) => x.fecha_asignacion > switchFecha[this.FiltroFecha.titulo]
        );
      }
    } else {
      this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
        resp.forEach(carga => carga.checked = false);
        resp.forEach((carga,i) => {
          carga.index = i+1;
        })
        this.cargasView = resp;
        if (this.FiltroFecha.titulo != 'Fecha' && this.FiltroEstado != 'Estado') {
          this.cargasGr.filter(
            (x) =>
              x.fecha_asignacion > switchFecha[this.FiltroFecha.titulo] &&
              x.nombreestado == this.FiltroEstado
          );
        } else if (this.FiltroFecha.titulo != 'Fecha') {
          this.cargasGr = this.cargasView.filter(
            (x) => x.fecha_asignacion > switchFecha[this.FiltroFecha.titulo]
          );
        } else if (this.FiltroEstado != 'Estado') {
          this.cargasGr = this.cargasView.filter(
            (x) => x.nombreestado == this.FiltroEstado
          );
        } else {
          this.cargasGr = resp;
        }
        // this.obtenerTotalIndicesTabla();
      });
      this.EstadoActual = 'NORMAL';
    }
  }

  ordenarFecha() {
    const switchFecha = {
      'Este Año': this.lastYearFormat,
      'Esta Semana': this.lastWeekFormat,
      'Este Mes': this.lastMonthFormat,
      Hoy: this.todayFormat,
    };
    console.log('lol' + this.FiltroEstado);

    if (this.EstadoFecha == 'NORMAL') {
      this.cargasGr.sort(
        (a, b) =>
          Date.parse(b.fecha_asignacion) - Date.parse(a.fecha_asignacion)
      );
      this.EstadoFecha = 'ASCENDENTE';
      if (this.FiltroEstado != 'Estado') {
        this.cargasGr.filter((x) => x.nombreestado == this.FiltroEstado);
      }
    } else if (this.EstadoFecha == 'ASCENDENTE') {
      this.cargasGr.sort(
        (a, b) =>
          Date.parse(a.fecha_asignacion) - Date.parse(b.fecha_asignacion)
      );
      this.EstadoFecha = 'DESCENDENTE';
      if (this.FiltroEstado != 'Estado') {
        this.cargasGr.filter((x) => x.nombreestado == this.FiltroEstado);
      }
    } else {
      this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
        resp.forEach(carga => carga.checked = false);
        resp.forEach((carga,i) => {
          carga.index = i+1;
        })
        this.cargasView = resp;

        if (this.FiltroFecha.titulo != 'Fecha') {
          if (this.EstadoFecha != 'Hoy') {
            console.log('ENTRASTE AQUI AÑO');
            this.cargasGr.filter(
              (x) => x.fecha_asignacion > switchFecha[this.EstadoFecha]
            );
          } else {
            this.cargasGr.filter(
              (x) => x.fecha_asignacion == switchFecha[this.EstadoFecha]
            );
          }
        }

        if (this.FiltroEstado != 'Estado') {
          this.cargasGr = this.cargasView.filter(
            (x) => x.nombreestado == this.FiltroEstado
          );
        }

        if(this.mostrarCalendario || this.FiltroEstado == 'Personalizada'){
          if(this.banderaHastaFecha){
            this.cargasGr.filter(x => x.fecha_asignacion > this.desdeCalendar && x.fecha_asignacion < this.hastaCalendar);

          }
        }

        if (this.FiltroEstado == 'Estado' && this.FiltroFecha.titulo == 'Fecha') {
          console.log('uwuwuwu');
          this.cargasGr = resp;
        }

       

       
        // this.obtenerTotalIndicesTabla();
      });
      this.EstadoFecha = 'NORMAL';
    }
  }

  InicializarFechas() {
    let today = new Date();
    this.todayFormat = this.datePipe.transform(today, 'yyyy-MM-dd');
    today.setDate(today.getDate() - 6);
    this.lastWeekFormat = this.datePipe.transform(today, 'yyyy-MM-dd');
    today.setDate(today.getDate() - 23);
    this.lastMonthFormat = this.datePipe.transform(today, 'yyyy-MM-dd');
    today.setDate(today.getDate() - 335);
    this.lastYearFormat = this.datePipe.transform(today, 'yyyy-MM-dd');
  }


  filtrarFechaPersonalizada(){

    console.log("Desde "+this.desdeCalendar+" hasta "+this.hastaCalendar);
    this.cargasGr = this.cargasView.filter(x => x.fecha_asignacion > this.desdeCalendar && x.fecha_asignacion < this.hastaCalendar);
  }

  eliminarIds(){

    this.cargasGr.forEach(x => {
      if(x.checked){
        this.listaCargasIdsDelete.push(x.id);
      }
    })
    console.log(this.listaCargasIdsDelete);

    this.cargaService.borrarCargas(this.listaCargasIdsDelete).subscribe(resp => {
      console.log(resp);
      this.mensajeExito = "Registros Eliminados Correctamente !"
      this.dispararAlerta = true;
      this.listaCargasIdsDelete = [];
      this.count = 0;
      this.cargaService.getCargas().subscribe( (resp:cargaGr[]) => {
        resp.forEach(carga => carga.checked = false);
        resp.forEach((carga,i) => {
          carga.index = i+1;
        })
        this.cargasGr = resp;
      })
      this.abrirFooter = false;
    },err => {
      console.log(err);
      this.listaCargasIdsDelete = [];
      this.count = 0;
    })
  }

  cerrarAlerta() {
    this.dispararAlerta = false;
  }
/* 
  abrirDrop(){
    this.open = false;
  } */

  actualizarFecha(opcion){
    this.FiltroFecha = opcion;
    console.log(opcion);
    if(opcion?.titulo == 'Personalizada'){
      this.mostrarCalendario = true;
    }else{
      this.mostrarCalendario = false;
      this.cambioFiltroFecha(this.FiltroFecha.titulo)
    }
  }

  choosedDate(event){
    this.mostrarCalendario = false;
     this.desdeCalendar = this.datePipe.transform(new Date(event.chosenLabel.split(" ")[0]),'yyyy-MM-dd');
     this.hastaCalendar = this.datePipe.transform(new Date(event.chosenLabel.split(" ")[2]),'yyyy-MM-dd');
     this.filtrarFechaPersonalizada();
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

   actualizarEstado(opcion){
    this.FiltroEstado = opcion;
    console.log(opcion);
      this.cambioFiltroEstado(this.FiltroEstado)
    }

}

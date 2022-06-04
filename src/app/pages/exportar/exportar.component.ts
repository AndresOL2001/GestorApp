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
  dropdownTableAbierto: boolean;
  dispararAlertaNoCargas: boolean;
  mensajeError: string;

  constructor(private cargaService: CargaGrService, private navService: NavbarService, private datePipe: DatePipe) {   }
  selected:any;


  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>
  cargasGr;
  cargasView;
  registrosPorPagina = 5;
  pageSizes = [5, 10, 15, 20, 30, 40, 50];

  //Filtrados tabla
  FiltroEstado = {
    titulo: 'Estatus',
    checked: false,
  };
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
    'ESTATUS',
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
    {
      titulo: 'Creado',
      checked: false,
      filtro: false,
    },
    {
      titulo: 'Asignado',
      checked: false,
      filtro: false,
    },
    {
      titulo: 'Notificado',
      checked: false,
      filtro: false,
    },
    {
      titulo: 'Localizado',
      checked: false,
      filtro: false,
    },
    {
      titulo: 'Gestoria en tramite',
      checked: false,
      filtro: false,
    },
    {
      titulo: 'Validacion digital',
      checked: false,
      filtro: false,
    },
    {
      titulo: 'Documentos entregados',
      checked: false,
      filtro: false,
    },
  ];


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


    this.mostrarMensajeInicial = true;
    this.FiltroEstado.titulo = 'Estatus';
    this.FiltroFecha.titulo = this.dropdownOptions[0].titulo;
    this.InicializarFechas();

    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      resp.forEach(carga => carga.checked = false);
      resp.forEach((carga,i) => {
        carga.index = i+1;
      })
      this.cargasGr = resp;
      this.cargasView = resp;
      this.cargasGr.sort((a, b) => b.index - a.index);

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
        resp.forEach((carga) => (carga.checked = false));
        resp.forEach((carga, i) => {
          carga.index = i + 1;
        });

        this.cargasGr = resp;
        this.cargasView = resp;
        this.cargasGr.sort((a, b) => b.index - a.index);

        if (this.FiltroEstado.titulo != 'Estatus') {
          this.cargasGr = this.cargasView.filter(
            (x) => x.nombreestado == this.FiltroEstado.titulo
          );
        }
        // this.obtenerTotalIndicesTabla();
        if (this.cargasGr.length == 0) {
          this.mostrarAvisoRegistros = true;
          setTimeout(() => {
            this.mensajeError = 'No se encontraron cargas con esos filtros.';
            this.dispararAlertaNoCargas = true;
          });
        }
      });
    } else if (event == 'Este Año') {
      if (this.FiltroEstado.titulo != 'Estatus') {
        this.cargasGr = this.cargasView.filter(
          (x) =>
            x.fecha_creacion > this.lastYearFormat &&
            x.nombreestado == this.FiltroEstado
        );
      } else {
        //console.log('uwuuwuwuwu');
        this.cargasGr = this.cargasView.filter(
          (x) => x.fecha_creacion > this.lastYearFormat
        );
      }
    } else if (event == 'Este Mes') {
      if (this.FiltroEstado.titulo != 'Estatus') {
        this.cargasGr = this.cargasView.filter(
          (x) =>
            x.fecha_creacion > this.lastMonthFormat &&
            x.nombreestado == this.FiltroEstado.titulo
        );
      } else {
        this.cargasGr = this.cargasView.filter(
          (x) => x.fecha_creacion > this.lastMonthFormat
        );
      }
    } else if (event == 'Esta Semana') {
      //console.log(event);

      if (this.FiltroEstado.titulo != 'Estatus') {
        this.cargasGr = this.cargasView.filter(
          (x) =>
            x.fecha_creacion > this.lastWeekFormat &&
            x.nombreestado == this.FiltroEstado.titulo
        );
      } else {
        this.cargasGr = this.cargasView.filter(
          (x) => x.fecha_creacion > this.lastWeekFormat
        );
      }
    } else {
      if (this.FiltroEstado.titulo != 'Estatus') {
        this.cargasGr = this.cargasView.filter(
          (x) =>
            x.fecha_creacion == this.todayFormat &&
            x.nombreestado == this.FiltroEstado
        );
      } else {
        this.cargasGr = this.cargasView.filter(
          (x) => x.fecha_creacion == this.todayFormat
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
      this.cargasGr.sort((a, b) => b.index - a.index);

    });
  }


  cambioFiltroEstado(e) {
    let arregloAux: cargaGr[] = [];
 
     this.dropdownOptionsEstados.forEach((item) => {
       if (item.checked) {
         this.cargaService
           .buscarTodo(item.titulo)
           .subscribe((resp: cargaGr[]) => {
          /*    resp.forEach((carga, i) => {
               carga.index = i + 1;
               carga.checked = false;
             }); */
 
             switch (this.FiltroFecha.titulo) {
               case 'Hoy':
                 resp = resp.filter((x) => x.fecha_creacion == this.todayFormat);
                 break;
               case 'Esta Semana':
                 resp = resp.filter(
                   (x) => x.fecha_creacion > this.lastWeekFormat
                 );
                 break;
               case 'Este Mes':
                 resp = resp.filter(
                   (x) => x.fecha_creacion < this.lastMonthFormat
                 );
                 break;
               case 'Personalizada':
                 resp = resp.filter(
                   (x) =>
                     x.fecha_creacion > this.desdeCalendar &&
                     x.fecha_creacion < this.hastaCalendar
                 );
                 break;
 
               default:
                 break;
             }
 
             resp.forEach((x) => {
               if (x.nombreestado == item.titulo && !item.filtro) {
                 arregloAux.push(x);
               }
             });
             if (arregloAux.length == 0) {
               this.mostrarAvisoRegistros = true;
               setTimeout(() => {
                 this.mensajeError =
                   'No se encontraron cargas con esos filtros.';
                 this.dispararAlertaNoCargas = true;
               }, 3000);
             }
           });
       }
     });
 
     this.cargasGr = arregloAux;
 
 
     this.comprobarFiltroEstadoCheckbox();
   }

   comprobarFiltroEstadoCheckbox() {
    if (this.dropdownOptionsEstados.every((x) => x.checked == false)) {
      this.actualizarCargas();
    }
  }

  actualizarCargas() {
    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      resp.forEach((carga) => (carga.checked = false));
      resp.forEach((carga, i) => {
        carga.index = i + 1;
      });
      this.cargasGr.sort((a, b) => b.index - a.index);


      this.cargasGr = resp;
      this.cargasView = resp;
      this.cargasGr.sort((a, b) => b.index - a.index);
      if (this.cargasGr.length == 0) {
        this.mostrarAvisoRegistros = true;
        setTimeout(() => {
          this.mensajeError = 'No se encontraron cargas con esos filtros.';
          this.dispararAlertaNoCargas = true;
        }, 3000);
      }
    });
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
      
      this.mensajeExito = "La exportacion se a realizado exitosamente"

      setTimeout(() => {
        this.dispararAlerta = true;
        this.mostrarMensajeInicial = false;

      },1500)

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

    if (head == 'ESTATUS') {
      head = 'nombreestado';
    }

    if (head == '#') {
      head = 'index';
    }

    if (this.EstadoActual == 'NORMAL') {
      this.EstadoActual = 'ASCENDENTE';

      this.cargasGr.sort(function (a, b) {
        if (b[head.toLowerCase()] > a[head.toLowerCase()]) {
          return 1;
        }
        if (a[head.toLowerCase()] > b[head.toLowerCase()]) {
          return -1;
        }
        return 0;
      });

    
    } else if (this.EstadoActual == 'ASCENDENTE') {
      //console.log("entraste aqui")

      this.cargasGr.sort(function (a, b) {
        if (a[head.toLowerCase()] > b[head.toLowerCase()]) {
          return 1;
        }
        if (a[head.toLowerCase()] < b[head.toLowerCase()]) {
          return -1;
        }
        return 0;
      });
      this.EstadoActual = 'DESCENDENTE';

      if (this.FiltroEstado.titulo != 'Estatus') {
        this.cargasGr.filter((x) => x.nombreestado == this.FiltroEstado.titulo);
      }

      if (this.FiltroFecha.titulo != 'Fecha') {
        this.cargasGr.filter(
          (x) => x.fecha_asignacion > switchFecha[this.FiltroFecha.titulo]
        );
      }
    } else {
      this.cargasGr.sort(function (a, b) {
        if (b[head.toLowerCase()] > a[head.toLowerCase()]) {
          return 1;
        }
        if (a[head.toLowerCase()] > b[head.toLowerCase()]) {
          return -1;
        }
        return 0;
      });

      this.EstadoActual = 'NORMAL';
    }
  }


  ordenarFecha() {

    console.log('lol' + this.FiltroEstado);

    if (this.EstadoFecha == 'NORMAL') {
      this.cargasGr.sort(
        (a, b) =>
          Date.parse(b.fecha_asignacion) - Date.parse(a.fecha_asignacion)
      );
      this.EstadoFecha = 'ASCENDENTE';
      if (this.FiltroEstado.titulo != 'Estado') {
        this.cargasGr.filter((x) => x.nombreestado == this.FiltroEstado.titulo);
      }
    } else if (this.EstadoFecha == 'ASCENDENTE') {
      this.cargasGr.sort(
        (a, b) =>
          Date.parse(a.fecha_asignacion) - Date.parse(b.fecha_asignacion)
      );
      this.EstadoFecha = 'DESCENDENTE';
      if (this.FiltroEstado.titulo != 'Estado') {
        this.cargasGr.filter((x) => x.nombreestado == this.FiltroEstado.titulo);
      }
    } else {
      this.cargasGr.sort(
        (a, b) =>
          Date.parse(b.fecha_asignacion) - Date.parse(a.fecha_asignacion)
      );


        // this.obtenerTotalIndicesTabla();
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
        this.cargasGr.sort((a, b) => b.index - a.index);

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
    this.dispararAlertaNoCargas = false;
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

    abrirDropdown(e) {
      let dropFecha = document.getElementById('ulDrop4');
      dropFecha.style.cssText = 'visibility:visible; opacity:1;';
  
      if (this.dropdownTableAbierto == true) {
        if (!dropFecha.contains(e.target as HTMLElement)) {
          console.log('fuera');
          dropFecha.style.cssText = 'visibility:hidden;opacity:0';
          this.dropdownTableAbierto = false;
          return;
        } else {
          console.log('dentro');
          this.dropdownTableAbierto = true;
          return;
        }
      }
  
      this.dropdownTableAbierto = true;
    }
}

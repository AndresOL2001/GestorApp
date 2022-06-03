import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { LinkedList } from 'src/app/Helpers/LinkedListEstados';
import { cargaGr } from 'src/app/models/cargaGr';
import { CargaGrConDetalle } from 'src/app/models/cargaGrConDetalle';
import { Estado } from 'src/app/models/estado';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import { EstadosService } from 'src/app/services/estados.service';
import { NavbarService } from 'src/app/services/navbar.service';
import * as ClassicEditor from '../../../../ckeditor/build/ckEditor';
import { Comentario, CargaComentario } from '../../models/comentario';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  comentarios: any[] = [];

  public editor: any = ClassicEditor;
  @ViewChild("ckeditor") ckeditor: any;

  cajaDescripcionComentario = ' ';
  checkboxRef;
  cargasGr: cargaGr[];
  cargasView: any[];

  //calendarioFecha
  desdeCalendar;
  hastaCalendar;
  banderaHastaFecha = false;

  //Tabla-Paginacion
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
    'PROVEEDOR',
  ];

  //Filtrados tabla
  FiltroEstado = 'Estado';
  FiltroFecha = {
    titulo: 'Sin Fecha',
    imagen: '../../../assets/sinfecha.png',
  };
  EstadoActual = 'NORMAL';
  EstadoFecha = 'NORMAL';

  //Fechas
  lastYearFormat;
  lastMonthFormat;
  lastWeekFormat;
  todayFormat;
  //banderas
  banderaEditar = false;
  banderaModal = false;
  banderaAnimacion = false;

  //Comentarios
  estadosComentarios: Estado[] = [];
  estadoComentarioActual: string;
  IdComentarioEliminar;

  //CargaModal
  cargaModal: cargaGr;

  //siguiente estado
  listaEstados = new LinkedList();
  estadoModalNext;

  //Alerta
  dispararAlerta = false;
  dispararAlertaError = false;
  dispararAlertaErrorActualizar = false;
  mensajeError = '';
  mensajeExito = '';

  //Variables proveedores
  proveedorAsignado = false;

  //List<Ids> delete
  listaCargasIdsDelete = [];
  abrirFooter = false;

  mostrarAvisoRegistros = false;
  mostrarMensajeInicial;

  //dropdown
  dropdownOptions = [
    {
      titulo: 'Fecha',
      imagen: '../../../assets/sinfecha.png',
    },
    {
      titulo: 'Hoy',
      imagen: '../../../assets/hoy.png',
    },
    {
      titulo: 'Esta Semana',
      imagen: '../../../assets/semana.png',
    },
    {
      titulo: 'Este Mes',
      imagen: '../../../assets/mes.png',
    },
    {
      titulo: 'Personalizada',
      imagen: '../../../assets/personalizada.png',
    },
  ];

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


  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  mostrarCalendario: boolean;
  open: boolean;
  estaSeguro: boolean;
  cancelarEliminar() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  constructor(
    private cargaService: CargaGrService,
    private nav: NavbarService,
    private datePipe: DatePipe,
    private estadoService: EstadosService,
  ) {}

  primeraVez:boolean = false;
  ngOnInit(): void {
    if(localStorage.getItem('FirstTime')){
      this.primeraVez = false;
    }else{
      this.primeraVez = true;
    }
    this.FiltroEstado = 'Estado';
    this.FiltroFecha.titulo = this.dropdownOptions[0].titulo;
    this.nav.show();
    window.addEventListener('click', function (e) {
      /*2. Si el div con id clickbox contiene a e. target*/
      if (document.getElementById('ulDrop').contains(e.target as HTMLElement)) {
        document.getElementById('ulDrop2').style.cssText =
          'visibility:visible;';
      } else {
        document.getElementById('ulDrop2').style.cssText = 'visibility:hidden;';
      }
    });

    window.addEventListener('click', function(e) {
      if (document.getElementById('ulDrop3').contains(e.target as HTMLElement)) {
        //console.log("dentro");
        document.getElementById('ulDrop4').style.cssText = "visibility:visible;"
      } else {
        //console.log("fuera");
        document.getElementById('ulDrop4').style.cssText = "visibility:hidden;"

      }
    })


    this.InicializarFechas();
    this.listaEstados.append('Estado');
    this.listaEstados.append('Creado');
    this.listaEstados.append('Asignado');
    this.listaEstados.append('Notificado');
    this.listaEstados.append('Localizado');
    this.listaEstados.append('Gestoria en tramite');
    this.listaEstados.append('Validacion digital');
    this.listaEstados.append('Documentos entregados');


    this.estadoService.obtenerEstados().subscribe((resp: Estado[]) => {
      this.estadosComentarios = resp;
    });
    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      resp.forEach((carga) => (carga.checked = false));
      resp.forEach((carga, i) => {
        carga.index = i + 1;
      });
      //console.log(resp);
      this.cargasGr = resp;
      this.cargasView = resp;
      this.primeraVez = false;
      if (this.cargasGr.length > 0) {
        this.mostrarAvisoRegistros = true;
      }
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

    if (head == '#') {
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
        resp.forEach((carga) => (carga.checked = false));
        resp.forEach((carga, i) => {
          carga.index = i + 1;
        });
        this.cargasView = resp;
        if (
          this.FiltroFecha.titulo != 'Fecha' &&
          this.FiltroEstado != 'Estado'
        ) {
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
      'Hoy': this.todayFormat,
    };

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
        resp.forEach((carga) => (carga.checked = false));
        resp.forEach((carga, i) => {
          carga.index = i + 1;
        });
        this.cargasView = resp;

        if (this.FiltroFecha.titulo != 'Fecha') {
          if (this.EstadoFecha != 'Hoy') {
            //console.log('ENTRASTE AQUI AÑO');
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

        if (
          this.FiltroEstado == 'Estado' &&
          this.FiltroFecha.titulo == 'Fecha'
        ) {
          // console.log('uwuwuwu');
          this.cargasGr = resp;
        }
        // this.obtenerTotalIndicesTabla();
      });
      this.EstadoFecha = 'NORMAL';
    }
  }

  cambioFiltroEstado(event) {
    const switchFecha = {
      'Este Año': this.lastYearFormat,
      'Esta Semana': this.lastWeekFormat,
      'Este Mes': this.lastMonthFormat,
      'Hoy': this.todayFormat,
    };

    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      resp.forEach((carga) => (carga.checked = false));
      resp.forEach((carga, i) => {
        carga.index = i + 1;
      });
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

  cambioFiltroFecha(event) {
    if (event == 'Fecha') {
      this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
        resp.forEach((carga) => (carga.checked = false));
        resp.forEach((carga, i) => {
          carga.index = i + 1;
        });
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

  abrirModal(carga: cargaGr) {
    this.banderaAnimacion = true;
    this.banderaModal = true;
    this.estadoModalNext = '';
    this.estadoModalNext = this.listaEstados.getByValue(carga.nombreestado);

    this.cargaModal = carga;

    if (this.cargaModal.proveedor != 'No Asignado') {
      this.proveedorAsignado = true;
    }

    this.estadoComentarioActual = this.cargaModal.nombreestado;

    this.cargaService.getComentarios(this.cargaModal.id).subscribe(
      (resp: any) => {
        //console.log(resp);
        this.comentarios = resp;
      },
      (err) => {
        this.comentarios = [];
        if (this.comentarios.length == 0) {
          this.crearComentario(
            'Registro importado correctamente y registrado con estatus de CREADO.',
            false
          );
        }
      }
    );

  }

  CerrarModal() {
    const card = document.getElementById('cardMove');
    card.classList.add('slide-right-home');
    this.banderaModal = false;
    setTimeout(() => {
      this.banderaAnimacion = false;
      this.proveedorAsignado = false;
    }, 350);
  }

  crearComentario(comentarioDescripcion: string, dispararAlerta: boolean) {
   // console.log(this.cargaModal.nombreestado);

    comentarioDescripcion = comentarioDescripcion.replace(/(<([^>]+)>)/gi, '');

    let estadoNuevoComentario = this.estadosComentarios.filter(
      (x) => x.nombre == this.estadoComentarioActual
    );

     let cargasId: CargaComentario[] = [];

    let cargaId: CargaComentario = {
      id: this.cargaModal.id,
    };
    cargasId.push(cargaId);

    let comentario: Comentario = {
      comentario: comentarioDescripcion,
      fecha: this.datePipe.transform(new Date(),'yyyy-MM-dd'),
      cargas: cargasId,
    };
    let estadoNuevoIdEstado:any = estadoNuevoComentario[0]?.IdEstado != null ? estadoNuevoComentario[0]?.IdEstado : 7;

    if (comentario.comentario.length > 1) {

      this.cargaService
        .crearComentario(comentario, estadoNuevoIdEstado)
        .subscribe((resp) => {
          this.mensajeExito = 'Comentario creado exitosamente!';
          this.dispararAlerta = dispararAlerta;
          //  console.log(resp);
          this.actualizarComentarios();
          this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
            resp.forEach((carga) => (carga.checked = false));
            resp.forEach((carga, i) => {
              carga.index = i + 1;
            });
            this.cargasView = resp;
          });
        });
    }

    if ( this.cargaModal.proveedor != 'No Asignado' && estadoNuevoComentario[0].nombre == 'Asignado') {
      this.cargaService
        .actualizarCarga(
          this.cargaModal.id,
          estadoNuevoIdEstado,
          this.cargaModal.proveedor
        )
        .subscribe((resp) => {
          this.mensajeExito = 'Registro actualizado correctamente!';
         // this.dispararAlerta = true;
          // console.log(resp);
        });
        comentario.comentario = 'Registro asignado correctamente al proveedor No.'+this.cargaModal.proveedor + ' Nuevo estatus asignado'
        this.cargaService
        .crearComentario(comentario, estadoNuevoComentario[0]?.IdEstado)
        .subscribe((resp) => {
          this.mensajeExito = 'Comentario creado exitosamente!';
          this.dispararAlerta = false;
          //  console.log(resp);
          this.actualizarComentarios();
          this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
            resp.forEach((carga) => (carga.checked = false));
            resp.forEach((carga, i) => {
              carga.index = i + 1;
            });
            this.cargasView = resp;
          });
        });
        return;
    } 

    if ( this.cargaModal.proveedor != 'No Asignado') {
      console.log("entraste aqui");
      this.cargaService
        .actualizarCarga(
          this.cargaModal.id,
          estadoNuevoIdEstado,
          this.cargaModal.proveedor
        )
        .subscribe((resp) => {
          this.mensajeExito = 'Registro actualizado correctamente!';
          this.dispararAlerta = true;
          // console.log(resp);
        });
    } 
  }

  actualizarComentarios() {
    this.cargaService
      .getComentarios(this.cargaModal.id)
      .subscribe((resp: any) => {
        // console.log(resp);
        this.comentarios = resp;
      });
  }

  cambiarEstatus(event) {
    this.estadoComentarioActual = event;
  }

  buscar(termino: string) {
    // console.log(termino);

    this.cargaService.buscarTodo(termino).subscribe((resp: any) => {
      //  console.log(resp);
      resp.forEach((carga) => (carga.checked = false));
      resp.forEach((carga, i) => {
        carga.index = i + 1;
      });
      this.cargasGr = resp;
    });
  }

  abrirEditarComentario() {
    this.banderaEditar = true;
  }

  actualizarComentarioCargadoModal(id: number) {
    let valorInput = (
      document.getElementById('inputActualizarComentario') as HTMLInputElement
    ).value;

    this.cargaService.actualizarComentario(id, valorInput).subscribe((resp) => {
      // console.log(resp);
      this.mensajeExito = 'Comentario Actualizado correctamente!';
      this.dispararAlerta = true;
      this.actualizarComentarios();
    });

    this.banderaEditar = false;
  }

  cerrarAlerta() {
    this.dispararAlertaError = false;
    this.dispararAlerta = false;
    this.dispararAlertaErrorActualizar = false;
    this.estaSeguro = false;
    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      resp.forEach((carga) => (carga.checked = false));
      resp.forEach((carga, i) => {
        carga.index = i + 1;
      });
      this.cargasGr = resp;
      this.cargasView = resp;
    });
  }

  eliminarComentario() {
    this.cargaService
      .eliminarComentario(this.IdComentarioEliminar)
      .subscribe((resp) => {
        //  console.log(resp);

        this.actualizarComentarios();
        this.mensajeExito = 'Comentario Eliminado correctamente';
        this.dispararAlerta = true;
      });
    this.dispararAlertaError = false;
  }

  abrirAlertaEliminarComentario(id: number) {
    this.IdComentarioEliminar = id;
    this.dispararAlertaError = true;
  }

  exportarCargaEspecifica(cargaModal: cargaGr) {
    // const formatYmd = (date) => date.toISOString().slice(0, 10);
    let cargaEspecifica: CargaGrConDetalle = {};
    cargaEspecifica.color = cargaModal.color;
    cargaEspecifica.correo = cargaModal.correo;
    cargaEspecifica.estadoActual = cargaModal.nombreestado;
    cargaEspecifica.origen = cargaModal.origen;
    cargaEspecifica.siniestro = cargaModal.siniestro;
    cargaEspecifica.fechaAsignacion = this.datePipe.transform(
      cargaModal.fecha_asignacion,
      'yyyy-MM-dd'
    ); /*  formatYmd(
      new Date(cargaModal.fecha_asignacion)) */
    cargaEspecifica.proveedor = cargaModal.proveedor;
    cargaEspecifica.comentario = [];

    this.comentarios.forEach((comentario) => {
      cargaEspecifica?.comentario.push(comentario);
    });

    for (let i = 0; i < this.comentarios.length; i++) {
      cargaEspecifica.comentario[i].idComentario =
        this.comentarios[i].id_Comentario;
    }

    this.mostrarMensajeInicial = true;

    this.cargaService
      .exportarCargaEspecifica(cargaEspecifica)
      .subscribe((resp) => {
        const blob = new Blob([resp], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        //window.open(url);
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        let date = new Date();
        let dateFormat = this.datePipe.transform(date, 'yyyy-MM-dd');
        link.download = `${dateFormat} / cargaEspecificaGr`;

        link.click();
        this.mostrarMensajeInicial = false;
      });
  }

  proveedorAux;
  cambiarProveedor(event) {
    if(event == 'No Asignado'){
      return;
    }
    this.estaSeguro = true;
    this.proveedorAux = event;
  }

  asignarProveedor() {
    this.cargaModal.proveedor = this.proveedorAux;
    if (this.cargaModal.proveedor != 'No Asignado') {
      this.proveedorAsignado = true;
    }
    this.cerrarAlerta();
  }
  count = 0;
  conteoIdsEliminar() {
    this.count = 0;
    this.cargasGr.forEach((item) => {
      if (item['checked']) {
        this.count = this.count + 1;
      }
    });
    //console.log(this.count);

    if (this.count > 0) {
      this.abrirFooter = true;
    } else {
      this.abrirFooter = false;
    }
  }

  cancelarEliminarIds() {
    this.cancelarEliminar();
    this.abrirFooter = false;
  }

  eliminarIds() {
    this.cargasGr.forEach((x) => {
      if (x.checked) {
        this.listaCargasIdsDelete.push(x.id);
      }
    });
    // console.log(this.listaCargasIdsDelete);

    this.cargaService.borrarCargas(this.listaCargasIdsDelete).subscribe(
      (resp) => {
        // console.log(resp);
        this.mensajeExito = 'Registros Eliminados Correctamente !';
        this.dispararAlerta = true;
        this.listaCargasIdsDelete = [];
        this.count = 0;
        this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
          resp.forEach((carga) => (carga.checked = false));
          resp.forEach((carga, i) => {
            carga.index = i + 1;
          });
          this.cargasGr = resp;
        });
        this.abrirFooter = false;
      },
      (err) => {
        console.log(err);
        this.listaCargasIdsDelete = [];
        this.count = 0;
      }
    );
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
    currentPage: 1,
  };
  public labels: any = {
    previousLabel: '<',
    nextLabel: '>',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`,
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
    this.eventLog.unshift(`${new Date().toISOString()}: ${message}`);
  }

  choosedDate(event) {
    this.mostrarCalendario = false;
    this.desdeCalendar = this.datePipe.transform(
      new Date(event.chosenLabel.split(' ')[0]),
      'yyyy-MM-dd'
    );
    this.hastaCalendar = this.datePipe.transform(
      new Date(event.chosenLabel.split(' ')[2]),
      'yyyy-MM-dd'
    );
    this.filtrarFechaPersonalizada();
  }
  filtrarFechaPersonalizada() {
    this.cargasGr = this.cargasView.filter(
      (x) =>
        x.fecha_asignacion > this.desdeCalendar &&
        x.fecha_asignacion < this.hastaCalendar
    );
  }
  abrirDrop() {
    this.open = true;
  }

  actualizarFecha(opcion) {
    this.FiltroFecha = opcion;
    console.log(opcion);
    if (opcion?.titulo == 'Personalizada') {
      this.mostrarCalendario = true;
    } else {
      this.mostrarCalendario = false;
      this.cambioFiltroFecha(this.FiltroFecha.titulo);
    }
  }

  actualizarEstado(opcion){
    this.FiltroEstado = opcion;
   //console.log(opcion);
      this.cambioFiltroEstado(this.FiltroEstado)
    }
}

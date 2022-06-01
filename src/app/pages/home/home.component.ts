import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
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
  cajaDescripcionComentario = ' ';
  checkboxRef;
  cargasGr: cargaGr[];
  cargasView: any[];

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
    'PROVEEDOR'
  ];

  //Filtrados tabla
  FiltroEstado;
  FiltroFecha;
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
  mensajeError = "";
  mensajeExito = "";

  //Variables proveedores
  proveedorAsignado = false;

  //List<Ids> delete
  listaCargasIdsDelete = [];
  abrirFooter = false;

  mostrarAvisoRegistros = false;

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>
cancelarEliminar() {
         this.checkboxes.forEach((element) => {
              element.nativeElement.checked = false;
    });
}

  constructor(
    private cargaService: CargaGrService,
    private nav: NavbarService,
    private datePipe: DatePipe,
    private estadoService: EstadosService
  ) { }

  ngOnInit(): void {
    this.FiltroEstado = 'Estado';
    this.FiltroFecha = 'Fecha';
    this.nav.show();
    this.InicializarFechas();
    this.listaEstados.append('Estado');
    this.listaEstados.append('Creado');
    this.listaEstados.append('Asignado');
    this.listaEstados.append('Notificado');
    this.listaEstados.append('Localizado');
    this.listaEstados.append('Validacion Digital');
    this.listaEstados.append('Gestoria en tramite');
    this.listaEstados.append('Documentos Entregados');

    this.estadoService.obtenerEstados().subscribe((resp: Estado[]) => {
      this.estadosComentarios = resp;
    });

    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      resp.forEach(carga => carga.checked = false);
      //console.log(resp);
      this.cargasGr = resp;
      this.cargasView = resp;
      if(this.cargasGr.length>0){
        this.mostrarAvisoRegistros = true;
      }
      
      setTimeout(() => {
        let registrosAlert = document.getElementById("registrosAlerta");
        registrosAlert.classList.add("fade-in")
       setTimeout(() => {
         this.mostrarAvisoRegistros = false;
       },1500)
      },3000)

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

      if (this.FiltroFecha != 'Fecha') {
        this.cargasGr.filter(
          (x) => x.fecha_asignacion > switchFecha[this.FiltroFecha]
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

      if (this.FiltroFecha != 'Fecha') {
        this.cargasGr.filter(
          (x) => x.fecha_asignacion > switchFecha[this.FiltroFecha]
        );
      }
    } else {
      this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
        this.cargasView = resp;
        if (this.FiltroFecha != 'Fecha' && this.FiltroEstado != 'Estado') {
          this.cargasGr.filter(
            (x) =>
              x.fecha_asignacion > switchFecha[this.FiltroFecha] &&
              x.nombreestado == this.FiltroEstado
          );
        } else if (this.FiltroFecha != 'Fecha') {
          this.cargasGr = this.cargasView.filter(
            (x) => x.fecha_asignacion > switchFecha[this.FiltroFecha]
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
        this.cargasView = resp;

        if (this.FiltroFecha != 'Fecha') {
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

        if (this.FiltroEstado == 'Estado' && this.FiltroFecha == 'Fecha') {
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
      Hoy: this.todayFormat,
    };

    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      this.cargasView = resp;
    });

    if (event == 'Estado') {
      if (this.FiltroFecha != 'Fecha') {
        if (this.FiltroFecha != 'Hoy') {
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
      if (this.FiltroFecha != 'Fecha') {
        if (this.FiltroFecha != 'Hoy') {
          this.cargasGr = this.cargasView.filter(
            (x) =>
              x.fecha_asignacion > switchFecha[this.FiltroFecha] &&
              x.nombreestado == this.FiltroEstado
          );
        } else {
          this.cargasGr = this.cargasView.filter(
            (x) =>
              x.fecha_asignacion == switchFecha[this.FiltroFecha] &&
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
            'Registro importado correctamente y registrado con estatus de CREADO.', false
          );
        }
      }
    );
  }

  CerrarModal() {
    const card = document.getElementById("cardMove")
    card.classList.add('slide-right-home');
    this.banderaModal = false;
    setTimeout(() => {
      this.banderaAnimacion = false;
      this.proveedorAsignado = false;
    }, 350);

  }

  crearComentario(comentarioDescripcion: string, dispararAlerta: boolean) {
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
      cargas: cargasId,
    };

    if (comentario.comentario.length > 1) {
      this.cargaService
        .crearComentario(comentario, estadoNuevoComentario[0].IdEstado)
        .subscribe((resp) => {
          this.mensajeExito = "Comentario creado exitosamente!"
          this.dispararAlerta = dispararAlerta;
        //  console.log(resp);
          this.actualizarComentarios();
        });
    } else {
      this.mensajeError = "El comentario no puede ser nulo"
      this.dispararAlertaErrorActualizar = true;
    }


    if (this.cargaModal.proveedor != 'No Asignado') {
      this.cargaService
        .actualizarCarga(
          this.cargaModal.id,
          estadoNuevoComentario[0].IdEstado,
          this.cargaModal.proveedor
        )
        .subscribe((resp) => {
          this.mensajeExito = "Registro actualizado correctamente!"
          this.dispararAlerta = true;
         // console.log(resp);
        });
    } else {
      this.mensajeError = "Favor de escoger un proveedor valido";
      this.dispararAlertaErrorActualizar = true;
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
      this.mensajeExito = "Comentario Actualizado correctamente!"
      this.dispararAlerta = true;
      this.actualizarComentarios();
    });

    this.banderaEditar = false;
  }

  cerrarAlerta() {
    this.dispararAlertaError = false;
    this.dispararAlerta = false;
    this.dispararAlertaErrorActualizar = false;
  }

  eliminarComentario() {
    this.cargaService
      .eliminarComentario(this.IdComentarioEliminar)
      .subscribe((resp) => {
      //  console.log(resp);

        this.actualizarComentarios();
        this.mensajeExito = "Comentario Eliminado correctamente"
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
    cargaEspecifica.fechaAsignacion = this.datePipe.transform(cargaModal.fecha_asignacion, "yyyy-MM-dd");/*  formatYmd(
      new Date(cargaModal.fecha_asignacion)) */
    ;
    cargaEspecifica.proveedor = cargaModal.proveedor;
    cargaEspecifica.comentario = [];

    this.comentarios.forEach((comentario) => {
      cargaEspecifica?.comentario.push(comentario);
    });

    for (let i = 0; i < this.comentarios.length; i++) {
      cargaEspecifica.comentario[i].idComentario =
        this.comentarios[i].id_Comentario;
    }

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
      });
  }

  cambiarProveedor(event) {
    this.cargaModal.proveedor = event;
    if (this.cargaModal.proveedor != 'No Asignado') {
      this.proveedorAsignado = true;
    }
  }
  count = 0;
  conteoIdsEliminar(){
    this.count = 0;
    this.cargasGr.forEach(item => {
      if (item['checked']) {
        this.count = this.count + 1;
      }
    })
    //console.log(this.count);

    if(this.count >0){
      this.abrirFooter = true;
    }else{
      this.abrirFooter = false;
    }

  }

  cancelarEliminarIds(){
    this.cancelarEliminar();
    this.abrirFooter = false;
  }

  eliminarIds(){

    this.cargasGr.forEach(x => {
      if(x.checked){
        this.listaCargasIdsDelete.push(x.id);
      }
    })
   // console.log(this.listaCargasIdsDelete);

    this.cargaService.borrarCargas(this.listaCargasIdsDelete).subscribe(resp => {
     // console.log(resp);
      this.mensajeExito = "Registros Eliminados Correctamente !"
      this.dispararAlerta = true;
      this.listaCargasIdsDelete = [];
      this.count = 0;
      this.cargaService.getCargas().subscribe( (resp:cargaGr[]) => {
        this.cargasGr = resp;
      })
      this.abrirFooter = false;
    },err => {
      console.log(err);
      this.listaCargasIdsDelete = [];
      this.count = 0;
    })
  }

}

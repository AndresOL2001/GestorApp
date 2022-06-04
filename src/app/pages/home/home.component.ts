import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
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
  @ViewChild('ckeditor') ckeditor: any;

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
    'PROVEEDOR',
  ];

  //Filtrados tabla
  FiltroEstado = {
    titulo: 'Estatus',
    checked: false,
  };
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

  dispararAlertaNoCargas;
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
    private estadoService: EstadosService
  ) {}


  primeraVez: boolean = false;
  ngOnInit(): void {
    if (localStorage.getItem('FirstTime')) {
      this.primeraVez = false;
    } else {
      this.primeraVez = true;
    }
    this.FiltroEstado.titulo = 'Estatus';
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

    this.InicializarFechas();
    this.listaEstados.append('Estatus');
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
      resp.forEach((carga, i) => {
        carga.index = i + 1;
        carga.checked = false
      });

      this.cargasGr = resp;
      this.cargasView = resp;
      this.cargasGr.sort((a, b) => b.index - a.index);

      this.primeraVez = false;

      if (this.cargasGr.length == 0) {
        this.mostrarAvisoRegistros = true;
        setTimeout(() => {
          this.mensajeError = 'No se encontraron cargas con esos filtros.';
          this.dispararAlertaNoCargas = true;
        }, 3000);
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

  InicializarFechas() {
    let today = new Date();
    this.todayFormat = this.datePipe.transform(today, 'yyyy-MM-dd');
    today.setDate(today.getDate() - 6);
    console.log(this.todayFormat);
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
      this.dispararAlertaError = false;
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
      fecha: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      cargas: cargasId,
    };
    let estadoNuevoIdEstado: any =
      estadoNuevoComentario[0]?.IdEstado != null
        ? estadoNuevoComentario[0]?.IdEstado
        : 7;

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
            this.cargasView.sort((a, b) => b.index - a.index);
          });
        });
    }

    if (
      this.cargaModal.proveedor != 'No Asignado' &&
      estadoNuevoComentario[0].nombre == 'Asignado'
    ) {
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
      comentario.comentario =
        'Registro asignado correctamente al proveedor No.' +
        this.cargaModal.proveedor +
        ' Nuevo estatus asignado';
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
            this.cargasView.sort((a, b) => b.index - a.index);
          });
        });
      return;
    }

    if (this.cargaModal.proveedor != 'No Asignado') {
      console.log('entraste aqui');
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
      this.cargasGr.sort((a, b) => b.index - a.index);

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
    this.dispararAlertaNoCargas = false;
    this.estaSeguro = false;
    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      resp.forEach((carga) => (carga.checked = false));
      resp.forEach((carga, i) => {
        carga.index = i + 1;
      });
      this.cargasGr = resp;
      this.cargasView = resp;
      this.cargasView.sort((a, b) => b.index - a.index);
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
    if (event == 'No Asignado') {
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
          this.cargasView.sort((a, b) => b.index - a.index);
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

  /*   actualizarEstado(opcion){
    this.FiltroEstado = opcion;
   //console.log(opcion);
      this.cambioFiltroEstado(this.FiltroEstado)
    } */

  dropdownTableAbierto = false;
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

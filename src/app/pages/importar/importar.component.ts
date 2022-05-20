import { Component, OnInit } from '@angular/core';
import { CargaGrService } from '../../services/carga-gr.service';
import * as ClassicEditor from '../../../../ckeditor/build/ckEditor';
import { NavbarService } from 'src/app/services/navbar.service';

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
  constructor(private cargaGrService:CargaGrService,private nav:NavbarService) { }

  ngOnInit(): void {
    this.nav.show();
  }

  onFileSelected(event){
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.banderaArchivoCargado=true;
       this.fileName = this.file.name;
       this.size = this.file.size;
    }
  }

  cancelarLayout(){
    this.banderaArchivoCargado=false;
    this.file = null;
  }

  cargarLayout(file){

    let extension = this.fileName.substring(this.fileName.lastIndexOf('.')+1, this.fileName.length);
    if(extension == 'xlsx'){
      this.cargaGrService.postCargas(file).subscribe(resp => {
        console.log(resp);
        this.dispararAlerta=true;
        this.dispararAlertaError=false;
        this.cancelarLayout();
      },err=>{
        this.dispararAlertaError=true;
        this.errorMensaje = err.error.mensaje;
      })
    }else if(extension == 'csv'){
      this.cargaGrService.postCargasCSV(file).subscribe(resp => {
        console.log(resp);
        this.dispararAlerta=true;
        this.cancelarLayout();
      },err=>{
        this.dispararAlertaError=true;
        this.errorMensaje = err.error.mensaje;
      })
    }else{
      this.dispararAlertaError=true;
      this.errorMensaje = "Cargue un archivo .csv o .xlsx";
      this.cancelarLayout();
    }
   
  }

  cerrarAlerta(){
    this.dispararAlerta = false;
    this.cancelarLayout();
  }
  }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Estado } from 'src/app/models/estado';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import { EstadosService } from 'src/app/services/estados.service';
import { NavbarService } from 'src/app/services/navbar.service';
import * as ClassicEditor from '../../../../ckeditor/build/ckEditor';

@Component({
  selector: 'app-estatus',
  templateUrl: './estatus.component.html',
  styleUrls: ['./estatus.component.css']
})
export class EstatusComponent implements OnInit {
bandera = false;
estados:Estado[];
public editor:any = ClassicEditor;

dispararAlerta=false;
dispararAlertaError=false;
estado:Estado;
  estadoMod:Estado;
  IdEstadoMod:number;
  estadoForm:FormGroup;
  constructor(private cargaService:CargaGrService,private fb:FormBuilder,private estadoService:EstadosService,private nav:NavbarService) { 
    this.estadoForm = this.fb.group({
      abreviatura:['',[Validators.required,Validators.minLength(3),Validators.maxLength(3)]],
      nombre:['',[Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
      descripcion:['',[Validators.required,Validators.maxLength(50)]],
      color:['',[Validators.required,Validators.maxLength(20)]],

    });
  }

  ngOnInit(): void {
    this.nav.show();
    if(this.IdEstadoMod != 0 && this.IdEstadoMod != null){
      this.estadoService.obtenerEstadoPorId(this.IdEstadoMod).subscribe( (resp:any) => {
        delete resp.idEstado;
        this.estadoMod = resp;
        console.log(this.estadoMod);
        this.rellenarCampos(this.estadoMod);
      })
    }
   this.actualizarTabla();
  }

  actualizarTabla(){
    this.estadoService.obtenerEstados().subscribe((resp:Estado[])=> {
      this.estados=resp;
      console.log(this.estados);
    })
  }

  eliminarEstado(id:number){
    console.log(id);
    this.estadoService.eliminarEstado(id).subscribe(resp => {
      this.actualizarTabla();
    });
  }
  rellenarCampos(estado:Estado){
    this.estadoForm.controls["descripcion"].setValue(estado.descripcion);
    this.estadoForm.controls["nombre"].setValue(estado.nombre);
    this.estadoForm.controls["abreviatura"].setValue(estado.abreviatura);
    this.estadoForm.controls["color"].setValue(estado.color);
  }

   

  crearEstado(){

    let regexHTML  = this.estadoForm.controls["descripcion"].value;

    regexHTML = regexHTML.replace( /(<([^>]+)>)/ig, '');
    this.estadoForm.controls["descripcion"].setValue(regexHTML);
    this.estado = this.estadoForm.value;
    console.log(this.estadoForm);
    if(this.estadoForm.valid){
      if(this.IdEstadoMod !=0 && this.IdEstadoMod != null){
        this.estado.IdEstado = this.IdEstadoMod;
        this.estadoService.actualizarEstado(this.estado).subscribe(resp => {
          console.log(resp);
          this.dispararAlerta = true;
          this.actualizarTabla();
        })
      }else{

      this.estadoService.crearEstado(this.estado).subscribe(resp => {
        console.log(resp);
        this.dispararAlerta = true;
        this.actualizarTabla();
      })
    }

    }else{
      this.dispararAlertaError = true;
    }
  
  }

  cerrarAlerta(){
    this.dispararAlerta = false;
    this.dispararAlertaError=false;
  }
  abrir(){
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import * as ClassicEditor from '../../../../ckeditor/build/ckEditor';
import { EstadosService } from '../../services/estados.service';
import { Estado } from 'src/app/models/estado';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit {

  public editor:any = ClassicEditor;

  dispararAlerta=false;
  dispararAlertaError=false;
  estado:Estado;
    estadoMod:Estado;
    IdEstadoMod:number;

  estadoForm:FormGroup;
  constructor(private cargaService:CargaGrService,private fb:FormBuilder,private estadoService:EstadosService,private activatedRoute:ActivatedRoute) { 
    this.estadoForm = this.fb.group({
      abreviatura:['',[Validators.required,Validators.minLength(3),Validators.maxLength(3)]],
      nombre:['',[Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
      descripcion:['',[Validators.required,Validators.maxLength(50)]],
      color:['',[Validators.required,Validators.maxLength(20)]],

    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.IdEstadoMod= Number(params.id)
    });

    if(this.IdEstadoMod != 0 && this.IdEstadoMod != null){
      this.estadoService.obtenerEstadoPorId(this.IdEstadoMod).subscribe( (resp:any) => {
        delete resp.idEstado;
        this.estadoMod = resp;
        console.log(this.estadoMod);
        this.rellenarCampos(this.estadoMod);
      })
    }
    
    //this.cargaService.getCargas().subscribe(resp => console.log(resp));
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
    if(this.estadoForm.valid){
      if(this.IdEstadoMod !=0 && this.IdEstadoMod != null){
        this.estado.IdEstado = this.IdEstadoMod;
        this.estadoService.actualizarEstado(this.estado).subscribe(resp => {
          console.log(resp);
          this.dispararAlerta = true;
  
        })
      }else{

      this.estadoService.crearEstado(this.estado).subscribe(resp => {
        console.log(resp);
        this.dispararAlerta = true;

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
}

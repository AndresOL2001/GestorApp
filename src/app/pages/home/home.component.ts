import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import * as ClassicEditor from '../../../../ckeditor/build/ckEditor';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit {

  public editor:any = ClassicEditor;
  
  estadoForm:FormGroup;
  constructor(private cargaService:CargaGrService,private fb:FormBuilder) { 
    this.estadoForm = this.fb.group({
      Abreviatura:['',[Validators.required,Validators.minLength(3),Validators.maxLength(3)]],
      Nombre:['',[Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
      Descripcion:['',[Validators.required,Validators.maxLength(50)]],
      Color:['',[Validators.required,Validators.maxLength(20)]],

    });
  }

  ngOnInit(): void {
  
    this.cargaService.getCargas().subscribe(resp => console.log(resp));
  }

  crearEstado(){

    let regexHTML  = this.estadoForm.controls["Descripcion"].value;

    regexHTML = regexHTML.replace( /(<([^>]+)>)/ig, '');
    this.estadoForm.controls["Descripcion"].setValue(regexHTML);
    console.log(this.estadoForm.value);
  }
}

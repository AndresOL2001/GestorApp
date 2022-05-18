import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import { EstadosService } from '../../services/estados.service';
import { Estado } from 'src/app/models/estado';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit {


cargasGr:any;
 
  constructor(private cargaService:CargaGrService) { 
   
  }

  ngOnInit(): void {

/*     this.activatedRoute.params.subscribe(params => {
      this.IdEstadoMod= Number(params.id)
    }); */

    
    this.cargaService.getCargas().subscribe(resp => {
      this.cargasGr=resp;
      console.log(resp);
    });
  }


}

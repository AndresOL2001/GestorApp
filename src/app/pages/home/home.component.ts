import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import { EstadosService } from '../../services/estados.service';
import { Estado } from 'src/app/models/estado';
import { ActivatedRoute } from '@angular/router';
import { NavbarService } from 'src/app/services/navbar.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit {


cargasGr:any;
public page:number;
 
  constructor(private cargaService:CargaGrService,private nav:NavbarService) { 
   
  }

  ngOnInit(): void {
    this.nav.show();
    this.cargaService.getCargas().subscribe(resp => {
      this.cargasGr=resp;
      console.log(resp);
    });
  }


}

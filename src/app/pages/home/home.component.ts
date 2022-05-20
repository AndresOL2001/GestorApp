import { Component, OnInit } from '@angular/core';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import { NavbarService } from 'src/app/services/navbar.service';
import * as ClassicEditor from '../../../../ckeditor/build/ckEditor';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit {
  public editor:any = ClassicEditor;


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

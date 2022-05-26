import { Component, OnInit } from '@angular/core';
import { cargaGr } from 'src/app/models/cargaGr';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.css']
})
export class ExportarComponent implements OnInit {

  constructor(private cargaService:CargaGrService,private navService:NavbarService,private datePipe:DatePipe) { }
cargasGr;
cargasView;
registrosPorPagina = 5;
pageSizes = [5, 10, 15, 20, 30, 40, 50];


  ngOnInit(): void {
    this.navService.show();

    this.cargaService.getCargas().subscribe((resp: cargaGr[]) => {
      this.cargasGr = resp;
      this.cargasView = resp;
      console.log(resp);
    });
  }

  cambioFiltroFecha(event){
if(event == 'Personalizada'){
  console.log("entre");
  let a = document.getElementById('desde');
  let b = document.getElementById('hasta');
    a.click();
    b.click();
}
  }

}

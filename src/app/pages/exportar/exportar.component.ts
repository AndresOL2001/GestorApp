import { Component, OnInit } from '@angular/core';
import { cargaGr } from 'src/app/models/cargaGr';
import { CargaGrService } from 'src/app/services/carga-gr.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.css']
})
export class ExportarComponent implements OnInit {

  constructor(private cargaService:CargaGrService,private navService:NavbarService) { }
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

}

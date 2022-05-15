import { Component, OnInit } from '@angular/core';
import { Estado } from 'src/app/models/estado';
import { EstadosService } from 'src/app/services/estados.service';
@Component({
  selector: 'app-estatus',
  templateUrl: './estatus.component.html',
  styleUrls: ['./estatus.component.css']
})
export class EstatusComponent implements OnInit {
bandera = false;
estados:Estado[];
  constructor(private estadoService:EstadosService) { }

  ngOnInit(): void {
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

  abrir(){
  }
}

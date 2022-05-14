import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class ImportarComponent implements OnInit {

  banderaArchivoCargado= false;
  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event){
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.banderaArchivoCargado=true;
      console.log(file);
    }
  }
}

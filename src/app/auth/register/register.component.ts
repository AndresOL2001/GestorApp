import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  nextStape=false;
  constructor() { }

  ngOnInit(): void {
  }

  avanzarPaso(){
    this.nextStape=true
  }
}

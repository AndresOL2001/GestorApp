import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  nextStape=false;
  constructor(private nav:NavbarService) { }

  ngOnInit(): void {
    this.nav.hide();
  }

  avanzarPaso(){
    this.nextStape=true
  }
}

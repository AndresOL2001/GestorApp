import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  oscuro = false;
  abierto =false;
  posicionNavbar = false;
  constructor() {}



  ngOnInit(): void {
    this.oscuro = false;

    //console.log(this.activated);

    const body = document.querySelector('body'),
        sidebar = body.querySelector('nav'),
        toggle = body.querySelector(".toggle"),
        searchBtn = body.querySelector(".nav-link"),
        modeSwitch = body.querySelector(".toggle-switch");
       let modeText:any = body.querySelector(".mode-text");
       let navbarposition = document.getElementById("Searchead");
    
       toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        if(this.posicionNavbar){
          
          this.posicionNavbar = false;
          navbarposition.classList.add('slide-left');
          navbarposition.classList.remove('slide-right');


        }else{
              this.posicionNavbar = true;
              navbarposition.classList.add('slide-right');
              navbarposition.classList.remove('slide-left');

       }
      })


     

  }


  modo(event){
    console.log(event.target.checked);
    document.body.classList.toggle("dark");
    if(this.oscuro){
      this.oscuro=false;
    }else{
      this.oscuro=true;
    }
  }

  cambiarEstadoCerrado(){
    document.body.classList.toggle("dark");
    if(this.oscuro){
      this.oscuro=false;
    }else{
      this.oscuro=true;
    }
  }
 /*  desplegarDropdown(){
    console.log("click")
  } */


}

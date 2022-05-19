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
  constructor() {}



  ngOnInit(): void {

    //console.log(this.activated);

    const body = document.querySelector('body'),
        sidebar = body.querySelector('nav'),
        toggle = body.querySelector(".toggle"),
        searchBtn = body.querySelector(".nav-link"),
        modeSwitch = body.querySelector(".toggle-switch");
       let modeText:any = body.querySelector(".mode-text");

       toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
      })


      searchBtn.addEventListener("click", () => {
        sidebar.classList.remove("close");
      })
   
     
      modeSwitch.addEventListener("click", () => {
        body.classList.toggle("dark");

        if(this.oscuro){
          this.oscuro=false;
        }else{
          this.oscuro=true;
        }
      });

  }

 /*  desplegarDropdown(){
    console.log("click")
  } */


}

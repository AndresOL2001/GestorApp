import { Component, OnInit} from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit{
  
  constructor(private router:Router,private navService:NavbarService) {}

  ngOnInit(): void {
   
  }


mostrarLogout:boolean = false;

MostrarLogout(){
  if(this.mostrarLogout){
    this.mostrarLogout = false;
  }else{
    this.mostrarLogout = true;
  }
}

cerrarSesion(){
  console.log("aqui")
  localStorage.removeItem("auth");
  this.router.navigateByUrl("/auth");
  this.navService.hide();

}

}

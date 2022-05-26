import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin:FormGroup;
  dispararAlerta=false;
  dispararAlertaError=false;
  constructor(private nav:NavbarService,private fb:FormBuilder,private router:Router) { 
    this.formLogin = this.fb.group({
      user:['',[Validators.required]],
      password:['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.nav.hide();
  }

  login(){
    if(this.formLogin.valid){
      let user = this.formLogin.controls["user"].value;
      let password = this.formLogin.controls["password"].value;

      if(user == environment.user && password == environment.password){
        localStorage.setItem("auth",'logging');
        this.router.navigateByUrl("/home");

      }else{
        this.dispararAlertaError = true;
      }

    }else{
      this.dispararAlertaError = true;
    }
  }

  cerrarAlerta(){
    this.dispararAlertaError = false;
  }

}

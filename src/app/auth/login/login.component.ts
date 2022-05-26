import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin:FormGroup;
  emailPattern:string='^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  constructor(private nav:NavbarService,private fb:FormBuilder) { 
    this.formLogin = this.fb.group({
      email:['',[Validators.required,Validators.pattern(this.emailPattern)]],
      password:['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.nav.hide();
  }

  onSubmit(){
  }

}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {


  constructor(private router:Router) {

    
  }
  canActivate(): Observable<boolean> | boolean  {
    let auth;
    if(localStorage.getItem("auth")){
      auth = localStorage.getItem("auth");
      if(auth=="logging"){
        return true;
      }
    }else{
      this.router.navigate(["/auth"]);
      return false;
    }
    
  }
  canLoad(): Observable<boolean> | boolean  {
    return true;
  }
}

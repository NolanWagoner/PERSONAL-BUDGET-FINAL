import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //Returns true upon existence of access_token
    if (localStorage.getItem('access_token')) {
      const helper = new JwtHelperService();
      if(!helper.isTokenExpired(localStorage.getItem('access_token'))){
        return true;
      } else{
        localStorage.clear();
        window.alert('Login token has expired: you have been automatically logged out')
      }
    }

    //Action for when user not verified
    this.router.navigate(['']);
    return false;
  }
}

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //Returns true upon existence of access_token
    if (localStorage.getItem('access_token')) {
      return true;
    }

    //Action for when user not verified
    this.router.navigate(['']);
      return false;
  }
}

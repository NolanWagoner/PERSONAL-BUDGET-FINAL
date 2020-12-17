import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {
  public username: string;
  public password: string;
  public error: string;

  constructor(public loginAuth: AuthService, private router: Router) { }

  public submit() {
    this.loginAuth.login(this.username, this.password)
      .pipe(first()).subscribe(
        result => this.router.navigate(['dashboard']),
        err => this.error = 'Authentication has failed, please try again'
      );
  }
}

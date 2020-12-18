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
    var errPara = document.getElementById('loginError') as HTMLParagraphElement;
    //Validate input
    if(this.username == ''){
      console.error('No value for username');
      errPara.innerHTML = 'Enter a value for username before submitting';
      return;
    } else if(this.password == ''){
      console.error('No value for password');
      errPara.innerHTML = 'Enter a value for password before submitting';
      return;
    }
    this.loginAuth.login(this.username, this.password)
      .pipe(first()).subscribe(
        result => this.router.navigate(['dashboard']),
        err => errPara.innerHTML = 'Authentication has failed, please try again (username or password may be incorrect)'
      );
  }
}

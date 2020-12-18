import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {
  public username: string;
  public password: string;
  public error: string;

  constructor(public loginAuth: AuthService, private http: HttpClient) { }

  public submit() {
    var errPara = document.getElementById('registerError') as HTMLParagraphElement;
    //Validate Input
    if(this.username == ''){
      console.error('Enter a value for username before submitting');
      errPara.innerHTML = 'Enter a value for username before submitting';
      return;
    } else if(this.password == ''){
      console.error('Enter a value for password before submitting');
      errPara.innerHTML = 'Enter a value for password before submitting';
      return;
    } else if(this.username.length < 5){
      console.error('Username must be 5 or more characters long');
      errPara.innerHTML = 'Username must be 5 or more characters long';
      return;
    } else if(this.username.length > 120){
      console.error('Username too long');
      errPara.innerHTML = 'Username must be shorter than 120 characters';
      return;
    } else if(this.password.length < 5){
      console.error('Password must be 5 or more characters long');
      errPara.innerHTML = 'Password must be 5 or more characters long';
      return;
    } else if(this.password.length > 120){
      console.error('Password too long');
      errPara.innerHTML = 'Password must be shorter than 120 characters';
      return;
    }
    //Check if username exists on backend
    var userExists;
    this.http.post('http://64.225.61.205:3000/isauser', {
      'username': this.username
    })
    .subscribe((res: any) => {
      if(res.isauser){
        console.error('Username is taken');
        errPara.innerHTML = 'An account already exists under that username';
        return;
      } else{
        //Post to backend
        this.http.post('http://64.225.61.205:3000/newuser', {
          'username': this.username,
          'password': this.password
        })
        .subscribe((res: any) => {
          //Clear form
          this.username = '';
          this.password = '';
          //Success message
          errPara.innerHTML = '';
          var registerGood = document.getElementById('registerGood') as HTMLParagraphElement;
          registerGood.innerHTML = 'New user has been added';
        });
      }
    });
  }
}

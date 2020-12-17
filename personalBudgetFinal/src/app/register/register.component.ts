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
    this.http.post('http://localhost:3000/newuser', {
      'username': this.username,
      'password': this.password
    })
    .subscribe((res: any) => {
      //error handling if needed
    });
    //Clear form
    this.username = '';
    this.password = '';
    //Success message
    var registerGood = document.getElementById('registerGood') as HTMLParagraphElement;
    registerGood.innerHTML = 'New user has been added';
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<boolean> {
    if(this.loggedIn){
      console.log('Already logged in')
      return;
    }

    return this.http.post<{token: string}>('http://64.225.61.205:3000/auth', {username: username, password: password})
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.token);
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['']);
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authUrl = environment.authenticationServer

  constructor(private http: HttpClient) { }

  login(email:string, password: string){
    return this.http.post(`${this.authUrl}/api/authenticate/login`,{email, password}).pipe(map( user => {
      localStorage.setItem('user', JSON.stringify(user))
      return user;
    }));
  }

  isLoggedIn () {
    if(localStorage.getItem('user')) return true;
    return false;
  }
}

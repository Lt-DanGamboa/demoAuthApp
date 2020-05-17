import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { ApiUserToken, Credentials } from '../interfaces/models';
import { HTTP } from "@ionic-native/http/ngx";

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
  constructor(private storage: Storage, private http: HttpClient, private nativeHttp: HTTP,
              private plt: Platform, private router: Router) { 
                this.loadStoredToken();
              }

  loadStoredToken(){
    const platformObs = from(this.plt.ready());
    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        console.log('Token found: ', token);
        if (token){
          const decoded = helper.decodeToken(token);
          console.log('Decoded token: ', decoded);
          this.userData.next(decoded);
          return true;
        }else{
          return null;
        }
      })
    );
  }

  login(credentials: Credentials): Observable<any>{
    // if (credentials.username !== 'user' || credentials.password !== '12345'){
    //   return of(null);
    // }
    console.log(credentials);
    return this.http.post<ApiUserToken>('http://192.168.1.79/api/Login/Login', credentials).pipe(
      map(res => {
        console.log(res);
        if (!res.success){ return null; }
        return res.token;
      }),
      switchMap(token => {
          let decoded = helper.decodeToken(token);
          this.userData.next(decoded);
          let storageObs = from(this.storage.set(TOKEN_KEY, token));
          return storageObs;
      })
    );
  }

  getUser(){
    return this.userData.getValue();
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { ApiUserToken, Credentials } from '../interfaces/models';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: Credentials = {
    username: 'user',
    password: '1234'
  };

  constructor(private auth: AuthService, private alertCtrl: AlertController, private router: Router, 
              private nativeHttp: HTTP, private http: HttpClient) { }

  ngOnInit() {

  }

  login(loginForm: NgForm){
    this.auth.login(loginForm.value).subscribe(async res => {
      if (res){
        this.router.navigateByUrl('/members');
      }else{
        const alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message: 'Wrong Credentials',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  logOut(){
    this.auth.logout();
  }


}

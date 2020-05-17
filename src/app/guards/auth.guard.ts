import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private auth: AuthService, private router: Router, private alertCtrl: AlertController){}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>{
    return this.auth.user.pipe(
      take(1),
      map(user => {
        console.log('In can activate:', user);
        if (!user){
          this.alertCtrl.create({
            header: 'Unauthorized',
            message: 'Failed to validate credentials',
            buttons: ['OK']
          }).then(alert => alert.present());
          this.router.navigateByUrl('/');
          return false;
        }else{
          return true;
        }
      })
    );
  }
}

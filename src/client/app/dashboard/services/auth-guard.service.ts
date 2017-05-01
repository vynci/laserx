import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {
	var x = true;
    if(x) {
      return true;
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
  }

}

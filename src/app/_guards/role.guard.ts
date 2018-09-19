import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import {AuthService} from '../services/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let role = next.data["role"] as Number;
      return this.checkLoggedIn(state.url,role);    
  }

  checkLoggedIn(url: string,role: Number): boolean {
    
    if (this.authService.isLoggedIn(url,role)) {
        return true;
    }

    //this.toastr.info("Please login to access this page.")
    this.router.navigate(['/auth/login']);
    return false;
  }
}

import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';



@Component({
  template: ''
})

export class LogoutComponent implements OnInit {
  
    constructor(private authService: AuthService,
        private router: Router,
        public toastr: ToastsManager) {
    }

    ngOnInit(){
        this.authService.logout();
        this.toastr.success('You have been logged out.','Success');
        this.router.navigate(['/auth/login']);
    }   

}
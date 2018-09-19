import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    public toastr: ToastsManager) {
  }

  fgtPwdForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]]
  });

  forgotPwd(formdata:any): void {    
    if (this.fgtPwdForm.dirty && this.fgtPwdForm.valid) {
      this.authService.forgotPassword(this.fgtPwdForm.value)
        .subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message,'Invalid');
          } else {
            this.toastr.success(data.message,'Success');
            this.router.navigate(['/auth/login']);
          }
          this.fgtPwdForm.reset();
        });
    }
  }

  ngOnInit() {
  }

}

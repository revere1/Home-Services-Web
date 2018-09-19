import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  private token:string;

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public toastr: ToastsManager) {
  }

  resetPwdForm: FormGroup = this.fb.group({
    password:[null,Validators.required],
    confirm_password: [null, Validators.required]
  },{validator: this.checkPasswords});

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password,
        confirmPass = group.controls.confirm_password; 
    return pass.value === confirmPass.value ? confirmPass.setErrors(null) : confirmPass.setErrors({ notSame: true });
  }

  resetPwd(formdata:any): void {  
    this.resetPwdForm.value['token'] = this.token;
    
    if (this.resetPwdForm.dirty && this.resetPwdForm.valid) {
      this.authService.resetPassword(this.resetPwdForm.value)
        .subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message,'Invalid');
          } else {
            this.toastr.success(data.message,'Success');
            this.router.navigate(['/auth/login']);
          }
          this.resetPwdForm.reset();
        });
    }
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      if((params.token !== undefined) || (params.token.length !== 0)){
        this.token = params.token;
      }
      else{
        this.toastr.error('Invalid Token','Error');
        this.router.navigate(['/auth/login']);
      }
    });
  }

}

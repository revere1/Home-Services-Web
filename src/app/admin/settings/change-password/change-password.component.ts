import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UtilsService } from '../../../services/utils.service';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  private token:string;

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService,
    public toastr: ToastsManager) {
  }

ChangePwdForm: FormGroup = this.fb.group({
    password:[null,Validators.required],
    confirm_password: [null, Validators.required]
  },{validator: this.checkPasswords});

  private _getSubmitObj() {
    
    let curUserObj = localStorage.getItem('currentUser');
      let currentUser = JSON.parse(curUserObj);
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password,
        confirmPass = group.controls.confirm_password; 
    return pass.value === confirmPass.value ? confirmPass.setErrors(null) : confirmPass.setErrors({ notSame: true });
  }

  changePwd(formdata:any): void {  
    // this.ChangePwdForm.value['id']= JSON.parse(localStorage.getItem('currentUser')).user.userid;
    this.ChangePwdForm.value['token'] = this.token;
    if (this.ChangePwdForm.dirty && this.ChangePwdForm.valid) {
      this.authService.changePassword(this.ChangePwdForm.value)
        .subscribe(data => {
          if (data.success === false) {
            this.toastr.error(data.message,'Invalid');
          } else {
            this.toastr.success(data.message,'Success');
            this.router.navigate(['/auth/login']);
          }
          this.ChangePwdForm.reset();
        });
    }
  }

  ngOnInit() {

            /*BreadCrumb*/
            let bcList = [{label: 'Home' , url: 'home', params: []},
            {label: 'ChangePassword' , url: 'change-password', params: []}
           ];
          this._utils.changeBreadCrumb(bcList);
          this._utils.currentBSource.subscribe(list => {
            this.breadcrumbsService.store(list);
          });
          /*End - BreadCrumb*/
    // this.activeRoute.queryParams.subscribe(params => {
    //   if((params.token !== undefined) || (params.token.length !== 0)){
    //     this.token = params.token;
    //   }
    //   else{
    //     this.toastr.error('Invalid Token','Error');
    //     this.router.navigate(['/auth/login']);
    //   }
    // });
  }
}

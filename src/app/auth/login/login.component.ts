import { Component, OnInit, ViewContainerRef,ViewEncapsulation, ElementRef, AfterViewInit} from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit,AfterViewInit {

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    public toastr: ToastsManager,
    private elementRef: ElementRef,
    private meta: Meta
  ) {   
  }
   ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#d1d3d4';
 }
  loginForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  loginUser(formdata:any): void {
    
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
  
        .subscribe(data => {
          if (data.success === false) {  
           
            this.toastr.error(data.message,'Invalid');
            
          } else {
            this.toastr.success('You have been successfully logged in.','Success');
            //if(data.data.access_level === 1)this.router.navigate(['/admin']);
            if(data.data.access_level === 1){
              let url = (data.data.status === 'active') ? ['/admin'] : ['/auth/updateprofile'];
              this.router.navigate(url);              
            }    
            // else if(data.data.access_level === 2){
            //   let url = (data.data.status === 'active') ? ['/client'] : ['/auth/updateprofile'];
            //   this.router.navigate(url);              
            // }    
            // else if(data.data.access_level === 3){
            //   let url = (data.data.status === 'active') ? ['/analyst'] : ['/auth/updateprofile'];
            //   this.router.navigate(url);              
            // } 
            // else if(data.data.access_level === 4){
            //   let url = (data.data.status === 'active') ? ['/editorier'] : ['/auth/updateprofile'];
            //   this.router.navigate(url);              
            // }         
            else this.router.navigate(['/auth/login']);
          }
          this.loginForm.reset();
        });
    }
  }

  ngOnInit() {

  }

}

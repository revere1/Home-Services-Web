import { Component, OnInit,ViewChild, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ClientModel } from '../../models/client.model';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl} from '@angular/forms';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ENV } from '../../env.config';
import { RequestOptions } from '@angular/http';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { Router } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateProfileComponent implements OnInit {
  routeSub: Subscription;
  clientForm: FormGroup;

  filesToUpload: Array<File>;
  private id: number;
  error: boolean;
  edit1 : boolean;
  loading: boolean;
  userSub: Subscription;
  userprofile: ClientModel;
  private currentUser : any;
  public serverURL = ENV.SERVER_URL;
  public avatar :string = null;
  dynamicImg :string = 'assets/img/avatar5.png';

  @ViewChild('fileInput') fileInput;

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder,
    private router: Router,   
    private _userapi: UserService,
    public utils: UtilsService,
    public toastr: ToastsManager
  ) 
  {
      this.filesToUpload = [];
      this.clientForm = new FormGroup({
      profile_pic : new FormControl(),

      });
    }
 
  ngOnInit() {
    
    this.edit1 = true
    this.id = this._userapi.getCurUserId();
    this._getUser();
    this.getAvatar();    
  }

  getAvatar(){
    this._userapi.getUserById$(this.id).subscribe((data)=>{
     this.dynamicImg = ((data.data.profile_pic != undefined) && (data.data.profile_pic.length)) 
                         ? ENV.SERVER_URL+data.data.profile_pic 
                         : this.dynamicImg;
      
     
    });
  }

  edit(){
    this.edit1 = true;
  }
  cancel(){
    this.edit1 = false;

  }

  updated(data){
    this.cancel();
    this.userprofile = data;   
  }
  

  fileChangeEvent(){

    
       let fileBrowser = this.fileInput.nativeElement;
       
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      
     formData.append("profile_pic", this.fileInput.nativeElement.files[0],this.fileInput.nativeElement.files[0].name);
     formData.append("id", String(this.id));
     this._userapi.upload(formData).subscribe(res => {
          if(res.success){
            
           this.dynamicImg = ENV.SERVER_URL + res.data.profile_pic;         
           this.userprofile.profile_pic=this.dynamicImg.replace(ENV.SERVER_URL,'');
           let t = JSON.parse(JSON.stringify(this.userprofile))
           this.userprofile=t;
           let that = this;
           $('.user-image,.img-circle').each(function(){
             $(this).attr('src',that.dynamicImg)
            });
            this.toastr.success(res.message,'Success');
          }
          else{
            this.toastr.error(res.message,'Error');
          }
       
      });
    }
  }

  onEdit():void {
  this.edit1 = false;
}


 
  
   
  private _getUser() {
    this.loading = true;
    // GET event by ID
    this.userSub = this._userapi
      .getUserById$(this.id)
      .subscribe(
        res => {
          
          if(res.success){

            this.userprofile = res.data;
            this.avatar = this.serverURL+this.userprofile.profile_pic; 
   
          }          
           this.loading = false;
        },
        err => {
          this.loading = false;
          this.error = true;
         
         
        }
      );
  
    }
}


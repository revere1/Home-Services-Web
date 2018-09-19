import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ClientModel } from '../../../models/client.model';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ENV } from '../../../env.config';
import { RequestOptions } from '@angular/http';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BreadcrumbsService } from 'ng2-breadcrumbs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  routeSub: Subscription;
  clientForm: FormGroup;

  filesToUpload: Array<File>;
  private id: number;
  error: boolean;
  edit1: boolean;
  loading: boolean;
  userSub: Subscription;
  nameById : any;
  userprofile: ClientModel;
  private currentUser: any;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  user : any;
  dynamicImg :string = 'assets/img/avatar5.png';

  @ViewChild('fileInput') fileInput;



  constructor(private http: HttpClient,
    private _userapi: UserService,
    public utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService,
    public toastr: ToastsManager) {
    this.filesToUpload = [];
    this.clientForm = new FormGroup({

    });
  }



  ngOnInit() {

    /*BreadCrumb*/
    let bcList = [{label: 'Home' , url: 'home', params: []},
      {label: 'Profile' , url: 'profile', params: []}];
    this.utils.changeBreadCrumb(bcList);
    this.utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/

    this.edit1 = false
    this.id = this._userapi.getCurUserId()
    this._getUser();
    this.getAvatar();
  }


  getAvatar(){
    let id = this._userapi.getCurUserId();
    this._userapi.getUserById$(id).subscribe((data)=>{
     this.dynamicImg = ((data.data.profile_pic != undefined) && (data.data.profile_pic.length)) 
                         ? ENV.SERVER_URL+data.data.profile_pic 
                         : this.dynamicImg;
      
     
    });
  }



  edit() {
    this.edit1 = true;

  }
  cancel() {
    this.edit1 = false;
  }
  // updated(data){
  //   this.cancel();
  //   this.userprofile = data;   
  // }

  // upload() {
  //   let fileBrowser = this.fileInput.nativeElement;

  //   if (fileBrowser.files && fileBrowser.files[0]) {
  //     const formData = new FormData();

  //     formData.append("profile_pic", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
  //     formData.append("id", String(this.id));
  //     this._userapi.upload(formData).subscribe(res => {
  //       if (res.success) {
  //         this.avatar = res.data;
  //         this.toastr.success(res.message, 'Success');
  //       }
  //       else {
  //         this.toastr.error(res.message, 'Error');
  //       }

  //     });
  //   }
  // }



  fileChangeEvent(){

    
    let fileBrowser = this.fileInput.nativeElement;
    
 if (fileBrowser.files && fileBrowser.files[0]) {
   const formData = new FormData();
   
  formData.append("profile_pic", this.fileInput.nativeElement.files[0],this.fileInput.nativeElement.files[0].name);
  formData.append("id", String(this.id));
  this._userapi.upload(formData).subscribe(res => {
       if(res.success){
        this.dynamicImg = ENV.SERVER_URL + res.data.profile_pic;
        let that = this;
        this.utils.updateUserSession(res.data);
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

  private _getUser() {
    this.loading = true;
    this.userSub = this._userapi
      .getUserById$(this.id)
      .subscribe(
      res => {
         if (res.success) {
            this.userprofile = res.data;
            this.avatar = this.serverURL + this.userprofile.profile_pic;
          }
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.error = true;
      }
      );
  }
  close(){
    this.edit1 = false;
  }
  onEdit():void {
    this._getUser();
    this.edit1 = false;

    }
   
}

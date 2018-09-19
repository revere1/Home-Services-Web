import { Component, OnInit, Input } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { UserFormService } from '../../../services/users/user-form.service'
import { FormUsersModel,FormUsersUpdateModel, UsersModel,UsersUpdateModel, } from '../../../models/users.model';
import { Subscription } from 'rxjs';
import { ENV } from '../../../env.config';
import { UsersService } from '../../../services/users/users.service';

import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

declare var $: any;
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() event: UsersModel;
  isEdit: boolean;
  userForm: FormGroup;
  formErrors: any;
  formChangeSub: Subscription;
  submitEventSub: Subscription;
  formEvent: FormUsersModel;
  uploadFilesObj = {};
  uploadFiles = [];
  apiEvents = [];
  submitting: boolean;
  error: boolean;

  submitEventObj: FormUsersModel;
  updateEventObj:FormUsersUpdateModel;
  canRemove: boolean = true;

  submitBtnText: string;

  public config: DropzoneConfigInterface = {};
  constructor(
              private fb: FormBuilder,
              private _ufs:UserFormService,
              private _userService:UsersService,
              public toastr: ToastsManager,
              private router: Router,
            ) {

              this.userForm = new FormGroup({
                user_name: new FormControl(),
                user_email: new FormControl(),
                user_mobile: new FormControl(),
                status: new FormControl()
              });
             }

  ngOnInit() {
    this.formErrors = this._ufs.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';

      this.formEvent = this._setFormEvent();
      this._buildForm();
    let that = this;
    this.config = {
      url: ENV.BASE_API + 'lockers/path?token=' + this._userService.getToken(),
      maxFiles: ENV.LOCKER_MAX_FILES,
      clickable: true,
      createImageThumbnails: true,
      addRemoveLinks: true,
      init: function () {
        let drop = this;
        this.on('removedfile', function (file) {
          /*If reupload already existed file, don t delet the file if max lik=mit crossed error uploaded*/
          if (file.status === 'error') {
            let index = (that.uploadFiles).indexOf(that.uploadFilesObj[file.upload.uuid]);
            if (index > -1) {
              return false;
            }
          }
          /*end*/
          if (that.canRemove) {
            //Removing values from array which are existing in uploadFiles variable         
            let index = (that.uploadFiles).indexOf(that.uploadFilesObj[file.upload.uuid]);
            if (index > -1) {
              if (that.uploadFiles.length === ENV.LOCKER_MAX_FILES) {
                that.formErrors['files'] = '';
                that._setErrMsgs(that.userForm.get('files'), that.formErrors, 'files');
              }
              (that.uploadFiles).splice(index, 1);
              that.removeFile(that.uploadFilesObj[file.upload.uuid]);
              delete that.uploadFilesObj[file.upload.uuid];
            }
          }
        });
        this.on('error', function (file, errorMessage) {

          drop.removeFile(file);
        });
        this.on('success', function (file) {
          $('.btn-group').addClass('open');
        });
      }
    }
  }


  private _buildForm() {
    let validRules;
    if(!this.isEdit){
    validRules = {
      user_name: [this.formEvent.user_name, [
        Validators.required
      ]],
      user_email: [this.formEvent.user_email, [
        Validators.required
      ]],
      password: [this.formEvent.password, [
        Validators.required
      ]],
      status: [this.formEvent.status, [
        Validators.required
      ]]
    };
  }else{
    validRules = {
      user_name: [this.formEvent.user_name, [
        Validators.required
      ]],
      user_email: [this.formEvent.user_email, [
        Validators.required
      ]],     
      status: [this.formEvent.status, [
        Validators.required
      ]]
    };
  }

    this.userForm = this.fb.group(validRules);
    // Subscribe to form value changes
    this.formChangeSub = this.userForm
      .valueChanges
      .subscribe(data => this._onValueChanged());
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.userForm);
    }
    this._onValueChanged();
  }

  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data



      return new FormUsersModel(null, null,null, null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data

      return new FormUsersModel(
        this.event.user_name,
        this.event.user_email,
        this.event.password,
        this.event.status        

      );
    }
  }
  public onUploadSuccess(eve) {
    if ((eve[1].success !== undefined) && eve[1].success) {
      this.formErrors['files'] = '';
      Object.assign(this.uploadFilesObj, { [eve[0].upload.uuid]: eve[1].data });
      (this.uploadFiles).push(eve[1].data);
    }
    else {
      this.formErrors['files'] = 'Something Went Wrong';
    }
    this._setErrMsgs(this.userForm.get('files'), this.formErrors, 'files');
  }

  public onUploadError(eve) {
    this.formErrors['files'] = eve[1];
    this._setErrMsgs(this.userForm.get('files'), this.formErrors, 'files');
  }
  _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this._ufs.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };
  private removeFile(file) {
    let apiEvent = this._userService.removeFile(file).subscribe(
      data => {
        this._handleSubmitSuccess(data);
      },
      err => this._handleSubmitError(err)
    );
    (this.apiEvents).push(apiEvent);
  }
  private _onValueChanged() {
    if (!this.userForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this._ufs.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] += messages[key] + '<br>';
          }
        }
      }
    };
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        _setErrMsgs(this.userForm.get(field), this.formErrors, field);
      }
    }
  }


  resetForm() {
    this.userForm.reset();
  }


  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      this.router.navigate(['/admin/users']);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }

  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  }

  public saveUser(){
    this.submitting = true;
   
    console.log(this.submitEventObj);
    if (!this.isEdit) {
      this.submitEventObj = this._getSubmitObj();
      this.submitEventSub = this._userService.postEvent$(this.submitEventObj)
      .subscribe(
        data => this._handleSubmitSuccess(data),
        err => this._handleSubmitError(err)
      );
    }else{
      this.updateEventObj = this._getUpdateObj();
      this.submitEventSub = this._userService
        .editEvent$(this.event.id, this.updateEventObj)
        .subscribe(

          data => this._handleSubmitSuccess(data),

          err => this._handleSubmitError(err)
        );

    }
  }

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
   
      return new UsersModel(
        this.userForm.get('user_name').value,
        this.userForm.get('user_email').value, 
        this.userForm.get('password').value,
        this.userForm.get('status').value,
        this.event ? this.event.id : null
      );
    
  }
  private _getUpdateObj() {
    return new UsersUpdateModel(
      this.userForm.get('user_name').value,
      this.userForm.get('user_email').value, 
      this.userForm.get('status').value,
      this.event ? this.event.id : null
    );
  }

}

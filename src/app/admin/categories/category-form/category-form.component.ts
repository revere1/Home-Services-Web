import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { CategoryFormService } from '../../../services/categories/category-form.service';
import { CategoriesModel, FormCategoriesModel } from '../../../models/categories.model';
import { ToastsManager } from 'ng2-toastr';
import { CategoriesService } from '../../../services/categories.service';
import { Router } from '@angular/router';
import { SubcategoriesService } from '../../../services/subcategories.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ENV } from '../../../env.config';
declare var $: any;
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class SectorFormComponent implements OnInit {

  @Input() event: CategoriesModel;

  categoryForm: FormGroup;
  isEdit: boolean;
  formEvent: FormCategoriesModel;
  formErrors: any;
  formChangeSub: Subscription;
  submitEventObj: FormCategoriesModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  submitBtnText: string;
  apiEvents = [];
  uploadFilesObj = {};
  uploadFiles = [];
  canRemove: boolean = true;
  public config: DropzoneConfigInterface = {};

  constructor(
    private fb: FormBuilder,
    public sc: CategoryFormService,
    private _subsectorService: SubcategoriesService,
    private router: Router,
    public toastr: ToastsManager,
    private _categoryService: CategoriesService,
  ) {
    this.categoryForm = new FormGroup({
      category_name: new FormControl(),
      category_desc: new FormControl(),
      status: new FormControl()
    });
  }

  ngOnInit() {
    this.formErrors = this.sc.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    this.formEvent = this._setFormEvent();
    this._buildForm();
    let that = this;
    this.config = {
      url: ENV.BASE_API + 'categories/path?token=' + this._categoryService.getToken(),
      maxFiles: ENV.LOCKER_MAX_FILES,
      clickable:true,
      createImageThumbnails:true,
      addRemoveLinks:true,
      init: function () {
        let drop = this;
        this.on('removedfile', function (file){
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
                that._setErrMsgs(that.categoryForm.get('files'), that.formErrors, 'files');
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
    };
  }
  _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this.sc.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };

  public onUploadSuccess(eve) {
    if ((eve[1].success !== undefined) && eve[1].success) {
      this.formErrors['files'] = '';
      Object.assign(this.uploadFilesObj, { [eve[0].upload.uuid]: eve[1].data });
      (this.uploadFiles).push(eve[1].data);
    }
    else {
      this.formErrors['files'] = 'Something Went Wrong';
    }
    this._setErrMsgs(this.categoryForm.get('files'), this.formErrors, 'files');
  }

  public onUploadError(eve) {
    this.formErrors['files'] = eve[1];
    this._setErrMsgs(this.categoryForm.get('files'), this.formErrors, 'files');
  }
  private removeFile(file) {
    let apiEvent = this._categoryService.removeFile(file).subscribe(
      data => {
        this._handleSubmitSuccess(data);
      },
      err => this._handleSubmitError(err)
    );
    (this.apiEvents).push(apiEvent);
  }
  private _buildForm() {
    let validRules = {
      category_name: [this.formEvent.category_name, [
        Validators.required
      ]],
      category_desc: [this.formEvent.category_desc, [
        Validators.required
      ]],
      status: [this.formEvent.status, [
        Validators.required
      ]]
    };

    this.categoryForm = this.fb.group(validRules);
    // Subscribe to form value changes
    this.formChangeSub = this.categoryForm
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
      _markDirty(this.categoryForm);
    }
    this._onValueChanged();
  }



  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormCategoriesModel(null, null, null,null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new FormCategoriesModel(
        this.event.category_name,
        this.event.category_desc,
        this.event.path,
        this.event.status
      );
    }
  }


  private _onValueChanged() {
    if (!this.categoryForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.sc.validationMessages[field];
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
        _setErrMsgs(this.categoryForm.get(field), this.formErrors, field);
      }
    }
  }


  resetForm() {
    this.categoryForm.reset();
  }

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new CategoriesModel(
      this.categoryForm.get('category_name').value,
      this.categoryForm.get('category_desc').value, 
      this.uploadFiles[0] ? this.uploadFiles[0] : this.event.path,     
      this.categoryForm.get('status').value,
      this.event ? this.event.id : null
    );
  }
  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      this.router.navigate(['/admin/categories']);
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

  saveCategory() {
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      this.submitEventSub = this._categoryService
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );

    } else {
      this.submitEventSub = this._categoryService
        .editEvent$(this.event.id, this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }
}
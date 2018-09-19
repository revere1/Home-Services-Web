import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { SubCategoryModel ,SubCategoryFormModel } from '../../../models/sub-category.model';
import { SubcategoriesService } from '../../../services/subcategories.service';
import { SubCategoryFormService } from '../../../services/sub-categories/sub-category-form.service';
import { Subscription } from 'rxjs/Subscription';
import { CategoriesService } from '../../../services/categories.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ENV } from '../../../env.config';
declare var $: any;

@Component({
  selector: 'app-sub-category-form',
  templateUrl: './sub-category-form.component.html',
  styleUrls: ['./sub-category-form.component.css']
})
export class SubCategoryFormComponent implements OnInit {

  @Input() event: SubCategoryModel;
  isEdit : boolean;
  subCategoryForm : FormGroup;
  apiEvents = [];
  formEvent: SubCategoryFormModel;
  formErrors: any;
  formChangeSub: Subscription;
  submitEventObj: SubCategoryModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  submitBtnText: string;
  categories: Object[];
  uploadFilesObj = {};
  uploadFiles = [];
  canRemove: boolean = true;
  public config: DropzoneConfigInterface = {};
  
  constructor(
    private fb: FormBuilder,
    private router : Router,
    private ssf : SubCategoryFormService,
    private _categoriesService: CategoriesService,
    private _subSectorrService :SubcategoriesService ,
    public toastr : ToastsManager) { 
    this.subCategoryForm = new FormGroup({
      subcategory_name: new FormControl(),
      category : new FormControl,
      status: new FormControl()
    });
  }

  ngOnInit() {

    $(document).ready(() => {
      let _that = this;
      $('#subcategory_desc').summernote({
      });
    });
    this.formErrors = this.ssf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    this.formEvent = this._setFormEvent(); 
    this._buildForm();

    //Fetch Countries
    this._categoriesService.getCategory$().subscribe(data => {
      if (data.success === false) {
      } else {
        this.categories = data.data;
        console.log(this.categories)
      }
    });

    let that = this;
    this.config = {
      url: ENV.BASE_API + 'subcategories/path?token=' + this._subSectorrService.getToken(),
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
                that._setErrMsgs(that.subCategoryForm.get('files'), that.formErrors, 'files');
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
  
  private _buildForm() {
    let validRules = {
      subcategory_name: [this.formEvent.subcategory_name, [
        Validators.required
      ]],
      category: [this.formEvent.category_id, [
        //Validators.required
      ]],
      subcategory_desc: [this.formEvent.subcategory_desc],
      status: [this.formEvent.status,
        Validators.required
      ],
    };
    this.subCategoryForm = this.fb.group(validRules);
    
    // Subscribe to form value changes
    this.formChangeSub = this.subCategoryForm
      .valueChanges
      .subscribe(data => this._onValueChanged());

    // If edit: mark fields dirty to trigger immediate
    // validation in case editing an event that is no
    // longer valid (for example, an event in the past)
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.subCategoryForm);
    }
    this._onValueChanged();
  }
  private _onValueChanged() {
    if (!this.subCategoryForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.ssf.validationMessages[field];
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
        _setErrMsgs(this.subCategoryForm.get(field), this.formErrors, field);         
      }
    }
  }
  _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this.ssf.validationMessages[field];
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
    this._setErrMsgs(this.subCategoryForm.get('files'), this.formErrors, 'files');
  }

  public onUploadError(eve) {
    this.formErrors['files'] = eve[1];
    this._setErrMsgs(this.subCategoryForm.get('files'), this.formErrors, 'files');
  }
  private removeFile(file) {
    let apiEvent = this._subSectorrService.removeFile(file).subscribe(
      data => {
        this._handleSubmitSuccess(data);
      },
      err => this._handleSubmitError(err)
    );
    (this.apiEvents).push(apiEvent);
  }
  
  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new SubCategoryModel(null, null, null,null,null);
    } else {

      // If editing existing event, create new
      // FormEventModel from existing data
    
      return new SubCategoryFormModel(
        this.event.category_id,
        this.event.subcategory_name,
        this.event.subcategory_desc,
        this.event.path,
        this.event.status,
    
      );
    }
  }

  private _getSubmitObj() {

    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new SubCategoryModel(
      this.subCategoryForm.get('category').value,
      this.subCategoryForm.get('subcategory_name').value,
      $('#subcategory_desc').summernote('code'),
      this.event ? this.event.path : this.uploadFiles[0],   
      this.subCategoryForm.get('status').value,
      this.event ? this.event.id : null
    );
  }

  saveSubCategory() {

    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    console.log(this.submitEventObj)
    if (!this.isEdit) {
      this.submitEventSub = this._subSectorrService
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      let curUserObj = localStorage.getItem('currentUser');
      let currentUser = JSON.parse(curUserObj);
      this.submitEventSub = this._subSectorrService
        .editEvent$(this.event.id, this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
     }
  }
  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if(res.success){
      this.toastr.success(res.message,'Success');  
      this.router.navigate(['/admin/sub-categories']);
    }
    else{       
      this.toastr.error(res.message,'Invalid');  
    }
    
  }

  private _handleSubmitError(err) {

    this.toastr.error(err.message,'Error');
    this.submitting = false;
    this.error = true;
  }
  resetForm() {
    this.subCategoryForm.reset();
  }

}

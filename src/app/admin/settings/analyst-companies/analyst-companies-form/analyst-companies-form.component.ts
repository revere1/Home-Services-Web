import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { CompanyFormService } from '../../../../services/company_details/company-form.service';
import { CompanyModel, FormCompanyModel } from '../../../../models/company_details.model';
import { Subscription } from 'rxjs/Subscription';
// import { SectorsService } from '../../../../services/sectors.service';
import { CountriesService } from '../../../../services/countries.service';
import { ENV } from '../../../../env.config';
import { CompanyService } from '../../../../services/company.service';

declare var $: any;

@Component({
  selector: 'app-analyst-companies-form',
  templateUrl: './analyst-companies-form.component.html',
  styleUrls: ['./analyst-companies-form.component.css']
})
export class AnalystCompaniesFormComponent implements OnInit {

  @Input() event: CompanyModel;
  isEdit: boolean;
  companyForm: FormGroup;
  formEvent: FormCompanyModel;
  formErrors: any;
  formChangeSub: Subscription;
  submitEventObj: CompanyModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  submitBtnText: string; 
  @ViewChild('fileInput') fileInput;
  public logo: any;
  public serverURL = ENV.SERVER_URL
  constructor(private fb: FormBuilder,
    private router: Router,
    public cf: CompanyFormService,
    private _companyapi:CompanyService,   
    public toastr: ToastsManager
  ) { }

  ngOnInit() {
    $(document).ready(() => {
      let _that = this;
      $('#about').summernote({
        callbacks: {
          onImageUpload: function (files) {

            _that.uploadFile(files, this);
          }
        },
      });
    });

    if(this.event && this.event['company_logo'] !== undefined){
      this.logo = this.event['company_logo'];
    }
    this.formErrors = this.cf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    this.formEvent = this._setFormEvent();
    this._buildForm();
  }
  private _buildForm() {
    let validRules = {
      name: [this.formEvent.name, [
        Validators.required
      ]],
      website: [this.formEvent.website],
      about: [this.formEvent.about,        
      ],
    };

    this.companyForm = this.fb.group(validRules);
    this.formChangeSub = this.companyForm
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
      _markDirty(this.companyForm);
    }
    this._onValueChanged();
  }
  private _onValueChanged() {
    if (!this.companyForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.cf.validationMessages[field];
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
        _setErrMsgs(this.companyForm.get(field), this.formErrors, field);
      }
    }
  }
  _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this.cf.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };
  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormCompanyModel(null,null,null,null,null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new FormCompanyModel(
        this.event.name,
        this.event.website,
        this.event.about,
        this.event.createdBy,
        this.event.updatedBy
      );
    }
  }
  uploadFile(files, editor) {
    {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("userphoto", files[i], files[i]['name']);
      }  
    }
  }

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new CompanyModel(
      this.companyForm.get('name').value,
      this.companyForm.get('website').value,
      $('#about').summernote('code'),
      currentUser.user.userid,
      currentUser.user.userid,      
      this.event ? this.event.id : null
    );
  }

  saveCompany() {
    let fileBrowser = this.fileInput.nativeElement;
    let formData = new FormData();
    if (fileBrowser.files && fileBrowser.files[0]) {      
      formData.append("logo", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
    }
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    for(let k in this.submitEventObj){      
      formData.append(k, this.submitEventObj[k]);
    }

    if ($('#about').summernote('isEmpty')) {
      this.formErrors['about'] = this.cf.validationMessages['about'].required;
      this._setErrMsgs(this.companyForm.get('about'), this.formErrors, 'about');
      return false;
    }
    else {
      this.formErrors['summary'] = '';
      this._setErrMsgs(this.companyForm.get('about'), this.formErrors, 'about');
    }
    if (!this.isEdit) {
      this.submitEventSub = this._companyapi
        .postEvent$(formData)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitEventSub = this._companyapi
        .editEvent$(this.event.id, formData)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      this.router.navigate(['/admin/settings/analyst-companies/']);
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
  resetForm() {
    this.companyForm.reset();
  }

  ngOnDestroy() {
    if (this.submitEventSub) {
      this.submitEventSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}

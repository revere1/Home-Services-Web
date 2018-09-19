import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ClientFormService } from '../../../../services/clients/client-form.service';
import { UserService } from '../../../../services/user.service';

import { ClientModel, FormClientModel } from '../../../../models/client.model';
import { Subscription } from 'rxjs/Subscription';
import { CategoriesService } from '../../../../services/categories.service';
import { SubcategoriesService } from '../../../../services/subcategories.service';
import { CountriesService } from '../../../../services/countries.service';
import { StatesService } from '../../../../services/states.service';
import { ENV } from '../../../../env.config';
import { UtilsService } from '../../../../services/utils.service';
declare var $: any;


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeForm: EventEmitter<any> = new EventEmitter<any>();  
  @Input() event: ClientModel;
  isEdit: boolean;
  clientForm: FormGroup;
  formData: any;
  // Model storing initial form values
  formEvent: FormClientModel;

  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  file: any;
  // Form submission
  submitEventObj: ClientModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  submitBtnText: string;

  sectors: Object[];
  subsectors: Object[];
  countries: Object[];
  states: Object[];

  constructor(private fb: FormBuilder,
    private router: Router,
    public cf: ClientFormService,
    private utils: UtilsService,
    private _userapi: UserService,
    private _sectorService: CategoriesService,
    private _subsectorService: SubcategoriesService,
    private _stateService: StatesService,
    private _countriesrService: CountriesService,
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
    this.formErrors = this.cf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    // Set initial form data
    this.formEvent = this._setFormEvent();
    this._buildForm();

    //Fetch sectors
    // this._sectorService.getSector$().subscribe(data => {
    //   if (data.success === false) {
    //   } else {
    //     this.sectors = data.data;
    //   }
    // });
    //Fetch Countries
    // this._countriesrService.getCountries$().subscribe(data => {
    //   if (data.success === false) {
    //   } else {
    //     this.countries = data.data;
    //   }
    // });
  }

  uploadFile(files, editor) {
    {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("userphoto", files[i], files[i]['name']);
      }
      this._userapi.uploads(formData).subscribe(res => {
        if (res.success) {
          res.data.forEach(path => {
            $(editor).summernote('insertImage', ENV.SERVER_URL + path, '');
          })
        }
      });
    }
  }
  private _buildForm() {
    let validRules = {
      first_name: [this.formEvent.first_name, [
        Validators.required
      ]],
      last_name: [this.formEvent.last_name, [
        Validators.required
      ]],
      email: [this.formEvent.email,
      Validators.required
      ],
      contact_number: [this.formEvent.contact_number,
      Validators.required
      ],
      company_name: [this.formEvent.company_name],
      company_url: [this.formEvent.company_url],
      sector_id: [this.formEvent.sector_id],
      subsector_id: [this.formEvent.subsector_id],
      country_id: [this.formEvent.country_id],
      state_id: [this.formEvent.state_id],
      city: [this.formEvent.city],
      about: [this.formEvent.about],
      zip_code: [this.formEvent.zip_code],
      access_level: [this.formEvent.access_level]
    };

    // if(this.isEdit){
    //   Object.assign(validRules,{
    //       password:[this.formEvent.password],
    //       confirm_password:[this.formEvent.confirm_password]
    //     }
    //   );
    // }
    // else{
    //   Object.assign(validRules,{
    //       password:[this.formEvent.password,
    //       Validators.required
    //     ],
    //     confirm_password:[this.formEvent.confirm_password,
    //       Validators.required
    //     ]}
    //   );
    // }

    this.clientForm = this.fb.group(validRules);

    // Subscribe to form value changes
    this.formChangeSub = this.clientForm
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
      _markDirty(this.clientForm);
    }
    this._onValueChanged();
  }

  // checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  //   let pass = group.controls.password,
  //     confirmPass = group.controls.confirm_password;
  //   return pass.value === confirmPass.value ? confirmPass.setErrors(null) : confirmPass.setErrors({ notSame: true });
  // }

  private _onValueChanged() {
    if (!this.clientForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.clientForm.get(field), this.formErrors, field);
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
  public sectorChange(sectorVal) {
    if (sectorVal !== 'null') {
      this._subsectorService.getSubcategory$(sectorVal).subscribe(data => {
        if (data.success === false) {
        } else {
          this.subsectors = data.data;
        }
      });
    }
    else {
      this.subsectors = [];
    }
  }
  public sectorChange1(sectorVal) {
    this.clientForm.controls['subsector_id'].patchValue(null);
    this.sectorChange(sectorVal)
  }

  public countryChange(countryVal) {
    if (countryVal !== 'null') {
      this._stateService.getState$(countryVal).subscribe(data => {
        if (data.success === false) {
        } else {
          this.states = data.data;
        }
      });
    }
    else {
      this.states = [];
    }
  }
  public countryChange1(sectorVal) {
    this.clientForm.controls['state_id'].patchValue(null);
    this.countryChange(sectorVal)
  }

  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormClientModel(null, null, null, null, null, null,null, null, null, null, null, null, null, null, null, 'Client');
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data

      if (this.event.sector_id) {
        this.sectorChange(this.event.sector_id)

      }
      if (this.event.country_id) {
        this.countryChange(this.event.country_id)
      }

      return new FormClientModel(
        this.event.first_name,
        this.event.last_name,
        this.event.email,
        this.event.contact_number,
        this.event.password,
        this.event.confirm_password,
        this.event.company_url,
        this.event.company_name,
        this.event.company_id,
        this.event.sector_id,
        this.event.subsector_id,
        this.event.country_id,
        this.event.state_id,
        this.event.city,
        this.event.zip_code,
        // this.event.createdBy,
        // this.event.updatedBy,
        this.event.access_level,
        this.event.about,
      );
    }
  }



  private _getSubmitObj() {

    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new ClientModel(
      this.clientForm.get('first_name').value,
      this.clientForm.get('last_name').value,
      this.clientForm.get('email').value,
      this.clientForm.get('contact_number').value,
      null,
      null,
      // this.clientForm.get('password').value,
      // this.clientForm.get('confirm_password').value,
      this.clientForm.get('company_url').value,
      this.clientForm.get('company_name').value,
      (this.clientForm.get('sector_id').value) ? this.clientForm.get('sector_id').value : null,
      (this.clientForm.get('sector_id').value) ? this.clientForm.get('sector_id').value : null,
      (this.clientForm.get('subsector_id').value) ? this.clientForm.get('subsector_id').value : null,
      (this.clientForm.get('country_id').value) ? this.clientForm.get('country_id').value : null,
      (this.clientForm.get('state_id').value) ? this.clientForm.get('state_id').value : null,
      this.clientForm.get('city').value,
      this.clientForm.get('zip_code').value,
      this.clientForm.get('access_level').value,
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      this.event ? this.event.status : 'active',
      this.event ? this.event.id : null,
      $('#about').summernote('code'),
    );
  }

  saveClient() {
    if ($('#about').summernote('isEmpty')) {
      this.formErrors['about'] = this.cf.validationMessages['about'].required;
      this._setErrMsgs(this.clientForm.get('about'), this.formErrors, 'about');
      return false;
    }
    else {
      this.formErrors['summary'] = '';
      this._setErrMsgs(this.clientForm.get('about'), this.formErrors, 'about');
    }
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();

    if (!this.isEdit) {
      this.submitEventSub = this._userapi
        .postEvent$({'data':JSON.stringify(this.submitEventObj)})
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {

      this.submitEventSub = this._userapi 
        .editEvent$(this.event.id, {'data':JSON.stringify(this.submitEventObj)})
        .subscribe(
          data => {
            let that = this;
            this.utils.updateUserSession(data.data);
            $('.hidden-xs,.user-name').each(function () {
              $(this).text(data.data.first_name + ' ' + data.data.last_name)
            });
            this._handleSubmitSuccess(data)
          },
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;

    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      // this.router.navigate(['/admin/clients']);
      this.edit.emit();
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
    this.clientForm.reset();
  }

  ngOnDestroy() {
    if (this.submitEventSub) {
      this.submitEventSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

  cancel(){
    this.closeForm.emit();
  }


}



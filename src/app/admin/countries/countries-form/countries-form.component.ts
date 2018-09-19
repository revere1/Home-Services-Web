import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { CountriesModel, FormCountriesModel } from '../../../models/countries.model';
import { Subscription } from 'rxjs/Subscription';
import { CountriesFormService } from '../../../services/countries/countries-form.service';
import { Router } from '@angular/router';
import { CountriesService } from '../../../services/countries.service';
import { ToastsManager } from 'ng2-toastr';
@Component({
  selector: 'app-countries-form',
  templateUrl: './countries-form.component.html',
  styleUrls: ['./countries-form.component.css']
})
export class CountriesFormComponent implements OnInit {
  @Input() event: CountriesModel;
  countriesForm: FormGroup;
  isEdit: boolean;
  // Model storing initial form values
  formEvent: FormCountriesModel;

  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;

  // Form submission
  submitEventObj: CountriesModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  submitBtnText: string;
  constructor(private fb: FormBuilder,
    private router: Router,
    private _countriesrService: CountriesService,
    public cf: CountriesFormService,
    public toastr: ToastsManager) {
    this.countriesForm = new FormGroup({
      name: new FormControl(),
      status: new FormControl()
    });
  }

  ngOnInit() {
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
      status: [this.formEvent.status, [
        Validators.required
      ]]
    };
    this.countriesForm = this.fb.group(validRules);
    // Subscribe to form value changes
    this.formChangeSub = this.countriesForm
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
      _markDirty(this.countriesForm);
    }
    this._onValueChanged();
  }
  
  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormCountriesModel(null, null,null,null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data

      return new FormCountriesModel(
        this.event.name,
        this.event.status,
        this.event.createdBy,
        this.event.updatedBy,

      );
    }
  }
  private _onValueChanged() {
    if (!this.countriesForm) { return; }
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
        _setErrMsgs(this.countriesForm.get(field), this.formErrors, field);
      }
    }
  }
  resetForm() {
    this.countriesForm.reset();
  }
  private _getSubmitObj() {
    
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new CountriesModel(
      this.countriesForm.get('name').value,
      this.countriesForm.get('status').value,
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      this.event ? this.event.id : null
    );
  }
  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if(res.success){
      this.toastr.success(res.message,'Success');  
      this.router.navigate(['/admin/countries']);
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
  saveCountries() {
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();

    if (!this.isEdit) {
      this.submitEventSub = this._countriesrService
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    
    } else {
      this.submitEventSub = this._countriesrService
        .editEvent$(this.event.id, this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }
}

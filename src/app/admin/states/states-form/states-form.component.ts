import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { StatesModel ,StatesFormModel } from '../../../models/states.model';
import { CountriesService } from '../../../services/countries.service';
import { StatesFormService } from '../../../services/states/states-form.service';
import { Subscription } from 'rxjs/Subscription';
import { StatesService } from '../../../services/states.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
@Component({
  selector: 'app-states-form',
  templateUrl: './states-form.component.html',
  styleUrls: ['./states-form.component.css']
})
export class StatesFormComponent implements OnInit {

  @Input() event: StatesModel;
  isEdit : boolean;
  statesForm : FormGroup;
  // Model storing initial form values
  formEvent: StatesFormModel;

  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;

  // Form submission
  submitEventObj: StatesModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  submitBtnText: string;

  countries: Object[];

  constructor(
    private fb: FormBuilder,
    private router : Router,
    private sf : StatesFormService,
    private _countriesrService: CountriesService,
    private _statesService :StatesService ,
    public toastr : ToastsManager) { 
    this.statesForm = new FormGroup({
      name: new FormControl(),
      country : new FormControl(),
      status: new FormControl()
    });
  }

  ngOnInit() {
    this.formErrors = this.sf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
        // Set initial form data
    this.formEvent = this._setFormEvent(); 
    this._buildForm();

    //Fetch Countries
    this._countriesrService.getCountries$().subscribe(data => {
      if (data.success === false) {
      } else {
        this.countries = data.data;
      }
    });
  }
  
  private _buildForm() {
    let validRules = {
      name: [this.formEvent.name, [
        Validators.required
      ]],
      country: [this.formEvent.country_id, [
        Validators.required
      ]],
      status: [this.formEvent.status,
        Validators.required
      ],
    };
    this.statesForm = this.fb.group(validRules);
    
    // Subscribe to form value changes
    this.formChangeSub = this.statesForm
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
      _markDirty(this.statesForm);
    }
    this._onValueChanged();
  }
  private _onValueChanged() {
    if (!this.statesForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.sf.validationMessages[field];
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
        _setErrMsgs(this.statesForm.get(field), this.formErrors, field);         
      }
    }
  }
  
  
  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new StatesFormModel(null, null, null,null,null);
    } else {

   
      // If editing existing event, create new
      // FormEventModel from existing data
    
      return new StatesFormModel(
        this.event.country_id,
        this.event.name,
        this.event.status,
        this.event.createdBy,
        this.event.updatedBy,
      );
    }
  }

  private _getSubmitObj() {
    

    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new StatesModel(
      this.statesForm.get('country').value,
      this.statesForm.get('name').value,
      this.statesForm.get('status').value,
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      this.event ? this.event.id : null
    );
  }

  saveState() {
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();

    if (!this.isEdit) {
      this.submitEventSub = this._statesService
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      
      this.submitEventSub = this._statesService
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
      this.router.navigate(['/admin/states']);
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
    this.statesForm.reset();
  }
 
}

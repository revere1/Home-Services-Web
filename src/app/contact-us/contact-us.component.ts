import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ContactUsModel, FormContactUsModel } from '../models/contact_us.model';
import { ContactUsFormService } from '../services/contact_us/contact-us-form.service';
import { UserService } from '../services/user.service';
declare var $: any;


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  @Input() event: ContactUsModel;
  contactForm: FormGroup;
  isEdit: boolean;
  apiEvents = [];
  // Model storing initial form values
  formEvent: FormContactUsModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  id: any;
  // Form submission
  submitEventObj: ContactUsModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  public sucessMsg:boolean=false;

  constructor(    private fb: FormBuilder,
    private router: Router,
    private _userapi:UserService,
    public cf: ContactUsFormService,
    public toastr: ToastsManager) { }

  ngOnInit() {
    this.formErrors = this.cf.formErrors;
    this.formEvent = this._setFormEvent();
    this._buildForm();
  }
  private _buildForm() {

    let validRules = {
      name: [this.formEvent.name, [
        Validators.required
      ]],
      mobile: [this.formEvent.mobile, [
        Validators.required
      ]],
      email: [this.formEvent.email, 
        [Validators.required,Validators.email]
      ],
      comments: [this.formEvent.comments, [
        Validators.required
      ]]
    };
    this.contactForm = this.fb.group(validRules);
    // Subscribe to form value changes
    let apiEvent = this.formChangeSub = this.contactForm
      .valueChanges
      .subscribe(data => this._onValueChanged());
    (this.apiEvents).push(apiEvent);
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.contactForm);
    }
    this._onValueChanged();
  }
  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormContactUsModel(null, null, null,null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new FormContactUsModel(
        this.event.name,
        this.event.mobile,
        this.event.email,
        this.event.comments,
        this.event ? this.event.id : null
      );
    }
  }
  private _onValueChanged() {

    if (!this.contactForm) { return; }

    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.contactForm.get(field), this.formErrors, field);
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
  private _getSubmitObj() {
    return new ContactUsModel(
      this.contactForm.get('name').value,
      this.contactForm.get('mobile').value,
      this.contactForm.get('email').value,
      this.contactForm.get('comments').value,
    );
  }
  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    this.sucessMsg = true;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
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
  submit() {
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
      let apiEvent = this.submitEventSub = this._userapi
        .ContactusPostEvent$(this.submitEventObj)
        .subscribe(
        data => {
          this._handleSubmitSuccess(data);
        },
        err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
  }

  public ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }
}

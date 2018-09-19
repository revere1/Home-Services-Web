import { Component, OnInit, Input, ViewChild, OnDestroy, Output, NgModule, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { OfferFormService } from '../../../services/offers/offer-form.service';
import { OffersService } from '../../../services/offers.service ';
import { OfferModel, FormOfferModel } from '../../../models/offer.model';
import { Subscription } from 'rxjs/Subscription';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ENV } from '../../../env.config';

declare var $: any;

@Component({
  selector: 'app-offer-form',
  templateUrl: './offer-form.component.html',
  styleUrls: ['./offer-form.component.css']
})
export class OfferFormComponent implements OnInit {

  @Input() event: OfferModel;
  @ViewChild('fileInput') fileInput;
  isEdit: boolean;
  offerForm: FormGroup;
  public serverURL = ENV.SERVER_URL
  apiEvents = [];
  offers = [];
  formEvent: FormOfferModel;
  formErrors: any;
  formChangeSub: Subscription;
  submitEventObj: OfferModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  offersData: any;
  submitBtnText: string;
  categories: Object[];
  subcategories: Object[];
  uploadFilesObj = {};
  uploadFiles = [];
  offer_img: any;
  routeSub: Subscription;
  public id: number;
  canRemove: boolean = true;
  finished: boolean = false;
  public config: DropzoneConfigInterface = {};
  public totalsize: number = 0.0;

  constructor(private fb: FormBuilder,
    private router: Router,
    public cf: OfferFormService,
    private _offerapi: OffersService,
    private route: ActivatedRoute,
    public toastr: ToastsManager
  ) { }

  ngOnInit() {
    $(document).ready(() => {
      let _that = this;
      $('#offer_description').summernote({
      });
    });
    this.routeSub = this.route.params
    .subscribe(params => {
      this.id = params['id'];
    });
  

    this.formErrors = this.cf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    this.formEvent = this._setFormEvent();
    this._buildForm();
    let that = this;
    this.config = {
      url: ENV.BASE_API + 'offers/path?token=' + this._offerapi.getToken(),
      maxFiles: ENV.PRODUCT_MAX_FILES,
      maxFilesize: ENV.HELP_MAX_SIZE,
      clickable: true,
      createImageThumbnails: true,
      addRemoveLinks: true,
      init: function () {
        let drop = this;
        this.on("addedfile", function (file) {
          that.totalsize += parseFloat((file.size / (1000 * 1000)).toFixed(2));
        });
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

            that.totalsize -= parseFloat((file.size / (1000 * 1000)).toFixed(2));
            //Removing values from array which are existing in uploadFiles variable         
            let index = (that.uploadFiles).indexOf(that.uploadFilesObj[file.upload.uuid]);
            if (index > -1) {
              if (that.uploadFiles.length === ENV.PRODUCT_MAX_FILES) {
                that.formErrors['files'] = '';
                that._setErrMsgs(that.offerForm.get('files'), that.formErrors, 'files');
              }
              (that.uploadFiles).splice(index, 1);
              //that.removeFile(that.uploadFilesObj[file.upload.uuid]);
              //delete that.uploadFilesObj[file.upload.uuid];
            }
          }
        });
        this.on('error', function (file, errorMessage) {
          drop.removeFile(file);
        });
        this.on('success', function (file) {
        });
      },
      /* Check for total all files size*/
      accept: function (file, done) {
        if (that.totalsize <= ENV.HELP_MAX_SIZE) {
          done();
        } else {
          done('Total size exceeded');
        }
      }
    };
    this._buildForm();
  }

  public onUploadSuccess(eve) {
    if ((eve[1].success !== undefined) && eve[1].success) {
      this.formErrors['files'] = '';
      console.log(this.uploadFiles)
      Object.assign(this.uploadFilesObj, { [eve[0].upload.uuid]: eve[1].data });
      (this.uploadFiles).push(eve[1].data);
    }
    else {
      this.formErrors['files'] = 'Something Went Wrong';
    }
    this._setErrMsgs(this.offerForm.get('files'), this.formErrors, 'files');
  };
  public onUploadError(eve) {
    this.formErrors['files'] = eve[1];
    this._setErrMsgs(this.offerForm.get('files'), this.formErrors, 'files');
  };

  private _buildForm() {
    let validRules = {
      offer_name: [this.formEvent.offer_name, [
        Validators.required
      ]],
      offer_code:  [this.formEvent.offer_code, [
        Validators.required
      ]],
      offer_description: [this.formEvent.desc, [
      ]],
      discount_type: [this.formEvent.discount_type, [
        Validators.required
      ]],
      discount_value:[this.formEvent.discount_value, 
        Validators.required, Validators.pattern["0-9*"]],
      limit: [this.formEvent.limit, 
        Validators.required, Validators.pattern["0-9*"]],
      limit_value: [this.formEvent.limit_value, 
         Validators.required, Validators.pattern["0-9*"]],
      status: [this.formEvent.status, [
        Validators.required
      ]]
    };
    this.offerForm = this.fb.group(validRules);

    // Subscribe to form value changes
    this.formChangeSub = this.offerForm
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
      _markDirty(this.offerForm);
    }
    this._onValueChanged();
  }
  private _onValueChanged() {
    if (!this.offerForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.offerForm.get(field), this.formErrors, field);
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


  // private removeFile(file) {
  //   let apiEvent = this._productapi.removeFile(file).subscribe(
  //     data => {
  //       this._handleSubmitSuccess(data);
  //     },
  //     err => this._handleSubmitError(err)
  //   );
  //   (this.apiEvents).push(apiEvent);
  // }
  
  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormOfferModel(null,null,null,null,null,null,null,null,null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data

      return new FormOfferModel(
        this.event.offer_name,
        this.event.offer_code,
        this.event.desc,
        this.event.discount_type,
        this.event.discount_value,
        this.event.limit,
        this.event.limit_value,
        this.event.offer_img,
        this.event.status,
       
        
      
      );
    }
  }
  resetForm() {
    this.offerForm.reset();
  }

  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);

    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new OfferModel(
      this.offerForm.get('offer_name').value,
      this.offerForm.get('offer_code').value,
      $('#offer_description').summernote('code'),
      this.offerForm.get('discount_type').value,
      this.offerForm.get('discount_value').value,
      this.offerForm.get('limit').value,
      this.offerForm.get('limit_value').value,
      this.event ? this.event.offer_img : this.uploadFiles[0],  
      this.offerForm.get('status').value,
      this.event ? this.event.id : null,
    );
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      this.router.navigate(['/admin/offers']);
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


  saveOffer() {
    // if ($('#offer_description').summernote('isEmpty')) {
    //   this.formErrors['offer_description'] = this.cf.validationMessages['offer_description'].required;
    //   this._setErrMsgs(this.offerForm.get('offer_description'), this.formErrors, 'offer_description');
    //   return false;
    // }
    // else {
    //   this.formErrors['offer_description'] = '';
    //   this._setErrMsgs(this.offerForm.get('offer_description'), this.formErrors, 'offer_description');
    // }

    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    console.log(this.submitEventObj)
    if (!this.isEdit) {
      this.submitEventSub = this._offerapi
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );

    } else {
      this.submitEventSub = this._offerapi
        .editEvent$(this.event.id, this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }
  }






 

 




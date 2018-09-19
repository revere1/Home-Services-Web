import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { LockerModel, FormLockerModel } from '../../../models/locker.model';
import { LockerFormService } from '../../../services/lockers/locker-form.service';
import { LockersService } from '../../../services/lockers.service';
import { UtilsService } from '../../../services/utils.service';
import { Subscription } from 'rxjs/Subscription';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper/dist/lib/dropzone.interfaces';
import { ENV } from '../../../env.config';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
declare var $: any;
@Component({
  selector: 'app-locker-form',
  templateUrl: './locker-form.component.html',
  styleUrls: ['./locker-form.component.css']
})
export class LockerFormComponent implements OnInit {

  additems: boolean = false;
  fileupload: boolean = true;
  showform: boolean = false;
  typename: string = 'Uploadfiles';
  showModel: boolean = false;
  popupid: number;
  image: string = "";
  public serverURL = ENV.SERVER_URL;
  filesdivision: boolean;
  notedivision: boolean;
  urldivision: boolean;
  public noRecords: boolean = true;
  @Input() event: LockerModel;
  isEdit: boolean;
  lockerForm: FormGroup;
  apiEvents = [];
  loading: boolean = true;
  // Model storing initial form values
  formEvent: FormLockerModel;
  id: any;
  users: Object[];
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitEventObj: LockerModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  submitBtnText: string;
  uploadFilesObj = {};
  uploadFiles = [];
  canRemove: boolean = true;
  public config: DropzoneConfigInterface = {};


  objLen: number = 10;
  dtOptions = {
    "draw": 1,
    "columns": [
      { "data": "title", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "typeId", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "note", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "url", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "createdBy", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "id", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }],
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
    "search": { "value": "", "regex": false }
  };
  finished = false  // boolean when end of database is reached
  locerItemsList: any;

  //error: boolean;
  //apiEvents = [];
  lockers = [];
  lockerpopup = [];
  switch: string = 'morelink';

  lockerFilterForm: FormGroup = this.fb.group({
    sortBy: ['recent'],
    status: [''],
    quickFilter: [''],
  });

  constructor(private fb: FormBuilder,
    private router: Router,
    public toastr: ToastsManager,
    public lf: LockerFormService,
    private _utils: UtilsService,
    private meta: Meta,
    private _LockersService: LockersService,
  ) { }

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.dtOptions.columns[4].search['value'] = currentUser.user.userid;
    this.getLockers();
    this.onChanges();
    this._LockersService.getLockerTypes().subscribe(data => {
      this.locerItemsList = data;
    });
    this.formErrors = this.lf.formErrors;
    this.isEdit = !!this.event;
    // Set initial form data
    this.formEvent = this._setFormEvent();
    this._buildForm();
    this.submitBtnText = this.isEdit ? 'Update' : 'Create';
    // files
    let that = this;
    this.config = {
      url: ENV.BASE_API + 'lockers/path?token=' + this._LockersService.getToken(),
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
                that._setErrMsgs(that.lockerForm.get('files'), that.formErrors, 'files');
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
    $('.dropdown-menu').click(function (e) {
      e.stopPropagation();

    });
  }
  AddItem() {
    this.additems = true;
    this.showform = false;
  }

  FileUpload() {
    this.typename = "Uploadfiles";
    this.additems = false;
    this.showform = true;
    this.filesdivision = true;
    this.notedivision = false;
    this.urldivision = false;
    this.canRemove = true;
  }

  AddNotes() {
    this.typename = "Addnote";
    this.additems = false;
    this.showform = true;
    this.filesdivision = false;
    this.notedivision = true;
    this.urldivision = false;
  }

  AddLink() {
    this.typename = "Addlink";
    this.additems = false;
    this.showform = true;
    this.filesdivision = false;
    this.notedivision = false;
    this.urldivision = true;
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
    this._setErrMsgs(this.lockerForm.get('files'), this.formErrors, 'files');
  }

  public onUploadError(eve) {
    this.formErrors['files'] = eve[1];
    this._setErrMsgs(this.lockerForm.get('files'), this.formErrors, 'files');
  }

  private _buildForm() {
    let validRules = {
      title: [this.formEvent.title, [
        Validators.required
      ]],
      note: [this.formEvent.note],
      url: [this.formEvent.url],
      typeId: [this.formEvent.typeId]
    };
    this.lockerForm = this.fb.group(validRules);
    // Subscribe to form value changes
    this.formChangeSub = this.lockerForm
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
      _markDirty(this.lockerForm);
    }
    this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.lockerForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.lf.validationMessages[field];
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
        _setErrMsgs(this.lockerForm.get(field), this.formErrors, field);
      }
    }
  }
  validCheckDuringSubmit(field) {
    this.formErrors[field] = this.lf.validationMessages[field].required;
    this._setErrMsgs(this.lockerForm.get(field), this.formErrors, field);
    this.submitting = false;
    return false;
  }

  saveLocker() {
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    switch (this.typename) {
      case 'Uploadfiles':
        if (!this.uploadFiles.length) return this.validCheckDuringSubmit('files'); break;
      case 'Addnote':
        if (!this.lockerForm.get('note').value) return this.validCheckDuringSubmit('note'); break;
      case 'Addlink':
        if (!this.lockerForm.get('url').value) return this.validCheckDuringSubmit('url');
    }

    if (!this.isEdit) {
      this.submitEventSub = this._LockersService
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => {
            this.canRemove = false;
            this.uploadFiles = [];
            this._handleSubmitSuccess(data);
            this.resetGrid();
            this.resetForm();
          },
          err => this._handleSubmitError(err)
        );
    }
  }

  private removeFile(file) {
    let apiEvent = this._LockersService.removeFile(file).subscribe(
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

      return new FormLockerModel(null, null, null, this.typename, []);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new FormLockerModel(
        this.event.title,
        this.event.note,
        this.event.url,
        this.event.typeId,
        this.event.files
      );
    }
  }


  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new LockerModel(
      this.lockerForm.get('title').value,
      this.lockerForm.get('note').value,
      this.lockerForm.get('url').value,
      this.typename,
      this.event ? this.event.createdBy : currentUser.user.userid,
      currentUser.user.userid,
      this.event ? this.event.files : this.uploadFiles,
      this.event ? this.event.id : null
    );
  }

  private _handleSubmitSuccess(res) {
    //this.getLockers();
    this.error = false;
    this.submitting = false;
    this.showform = false;
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
  _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
    if (control && control.dirty && control.invalid) {
      const messages = this.lf.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          errorsObj[field] += messages[key] + '<br>';
        }
      }
    }
  };
  onChanges() {
    this.lockerFilterForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        this.dtOptions.columns[1].search['value'] = val.status;
        this.dtOptions.search = { "value": val.quickFilter, "regex": false };
        this.dtOptions.order[0].dir = (val.sortBy === 'recent') ? "desc" : 'asc';
        this.resetGrid();
      });
  }
  resetGrid() {
    this.dtOptions.start = 0;
    this.dtOptions.length = this.objLen;
    this.finished = false;
    this.lockers = [];
    this.getLockers();
  }
  onScroll() {
    this.dtOptions.start += this.objLen;
    this.getLockers();
  }
  modelopen(id) {
    this.popupid = id;
    this.finished = false;
    this.lockerpopup = [];
    this.getLocker();
    this.showModel = true;
  }
  private getLockers(append = true) {
    if (this.finished) return;
    this._LockersService
      .filterLockers$(this.dtOptions, 'filter-lockers')
      .subscribe(data => {
        if (this.noRecords && data.data.length) {
          this.noRecords = false;
        }
        if (data.data.length !== this.objLen) {
          this.finished = true;
        }
        this.lockers = (this.lockers).concat(data.data);
      })
  }
  private getLocker(append = true) {
    if (this.finished) return;
    this._LockersService
      .getLockerById$(this.popupid)
      .subscribe(data => {
        this.loading = false;
        this.finished = true;
        this.lockerpopup = (this.lockerpopup).concat(data);
        this.image = this.serverURL;
      })
  }
  DownloadFiles(file) {
    //var blob = new Blob(['http://localhost:1332/locker_files/e8c0a25634d3b9e368737d4f139b4884-3.jpg'], { type: 'image/jpg' });
    //var url= window.URL.createObjectURL(blob);
    window.open(ENV.SERVER_URL + file, 'download');
  }
  resetForm() {
    this.lockerForm.reset();
  }
  ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }
}

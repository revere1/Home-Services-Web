import { Component, OnInit, Input, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { HelpFormService } from '../../../services/help/help-form.service';
import { HelpCommentModel, FormHelpCommentModel } from '../../../models/helpcomment.model';
import { ToastsManager } from 'ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HelpService } from '../../../services/help.service';
import { UtilsService } from '../../../services/utils.service';
import { ENV } from '../../../env.config';

declare var $: any;
@Component({
  selector: 'app-help-comments-form',
  templateUrl: './help-comments-form.component.html',
  styleUrls: ['./help-comments-form.component.css']
})
export class HelpCommentsFormComponent implements OnInit {
  @Input() event: HelpCommentModel;
  isEdit: boolean;
  helpcommentForm: FormGroup;
  apiEvents = [];
  routeSub: Subscription;
  private id: number;
  private pid: number;
  private createdBy: number;
  problemsData: any;
  problemsData2: any;
  prbId: number;
  // Model storing initial form values
  formEvent: FormHelpCommentModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitEventObj: HelpCommentModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  submitBtnText: string;
  reply: boolean;
  private descriptionLimitChars = 20;
  private tryingToPaste = false;
  canRemove: boolean = true;
  @Input() replyFor: any;
  @Output() UpdateReplyId: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public cf: HelpFormService,
    private _helpapi: HelpService,
    private route: ActivatedRoute,
    public utils: UtilsService,
    public toastr: ToastsManager
  ) {
    this.helpcommentForm = new FormGroup({
      //subject: new FormControl(),
      description: new FormControl(),
      status: new FormControl()
    });

  }

  ngOnInit() {
    this.reply = false;
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
      });
    this._helpapi.getHelpById$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.problemsData = data.data;
      }
      this.formEvent = this._setFormEvent();
      this._buildForm();
    });
    this.formErrors = this.cf.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update' : 'Send';
    let _that = this;
    $(document).ready(() => {
      let that = this;
      $('#description').summernote({
        toolbar: ENV.SUMMER_SETUP.toolbar,
        callbacks: {
          onPaste: function (e) {
            _that.tryingToPaste = true;
            console.log('Called event paste');
          }
        },
      });
    });
  }

  private _buildForm() {
    let validRules = {
      description: [this.formEvent.message, [
        // Validators.required
      ]],
      status: [this.formEvent.status, [
        // Validators.required
      ]]
    };
    this.helpcommentForm = this.fb.group(validRules);
    // Subscribe to form value changes
    let apiEvent = this.formChangeSub = this.helpcommentForm
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
      _markDirty(this.helpcommentForm);
    }
    this._onValueChanged();
  }
  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormHelpCommentModel(null, this.problemsData[0].status, null, null, null, null, null, null, null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      return new FormHelpCommentModel(
        this.event.message,
        this.event.status,
        this.event.parentId,
        this.event.is_read,
        this.event.problemId,
        this.event.msgTo,
        this.event.createdBy,
        this.event.resolvedBy,
        this.event.resolved_date
      );
    }
  }
  private _onValueChanged() {
    if (!this.helpcommentForm) { return; }
    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        this._setErrMsgs(this.helpcommentForm.get(field), this.formErrors, field);
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
  resetForm() {
    this.helpcommentForm.reset();
    $("#description").summernote("reset")
  }
  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new HelpCommentModel(
      //this.helpcommentForm.get('description').value,
      $('#description').summernote('code'),
      this.helpcommentForm.get('status').value,
      this.replyFor,
      0,
      this.problemsData[0].pid,
      // this.event ? this.event.msgTo : this.problemsData[0].createdBy,
      (this.problemsData[0].createdBy == currentUser.user.userid) ? this.problemsData[0].msgTo : this.problemsData[0].createdBy,
      this.event ? this.event.createdBy : currentUser.user.userid,
      (this.helpcommentForm.get('status').value === 'Resolved') ? currentUser.user.userid : null,
      (this.helpcommentForm.get('status').value === 'Resolved') ? null : null,
      this.event ? this.event.id : null
    );
  }
  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
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
  saveHelpComment(problemId) {
    $('#helpitem' + problemId).remove();
    $("#rehelpcounthead,#rehelpcount").text(function (v, n) {
      if (JSON.parse(n) != 0) {
        return JSON.parse(n) - 1;
      } else {
        return 0;
      }
    });
    this.reply = false;
    if ($('#description').next('.note-editor').find('.note-editable').text().length < this.descriptionLimitChars) {
      this.formErrors['description'] = this.cf.validationMessages['description'].required;
      this._setErrMsgs(this.helpcommentForm.get('description'), this.formErrors, 'description');
      return false;
    }
    else {
      this.formErrors['description'] = '';
      this._setErrMsgs(this.helpcommentForm.get('description'), this.formErrors, 'description');
    }
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();
    if (!this.isEdit) {
      let apiEvent = this.submitEventSub = this._helpapi
        .postEvents$(this.id, this.submitEventObj)
        .subscribe(
          data => {
            this.replyFor = data.data.comment.id;
            data.data.comment.profile_pic = (data.data.user.user_profile !== undefined) ? data.data.user.user_profile.profile_pic : null;
            this.UpdateReplyId.emit({ 'newComment': data.data.comment, 'rid': data.data.comment.id });
            this._handleSubmitSuccess(data);
            this.canRemove = false;
          },
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }
  cancel() {
    this.reply = false;
    this.router.navigate(['/admin/help']);
  }
  public ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }
}
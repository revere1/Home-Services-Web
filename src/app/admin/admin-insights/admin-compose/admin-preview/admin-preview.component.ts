import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ComposeService } from '../../../../services/compose.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../services/utils.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ComposeModel } from '../../../../models/compose.model';
import { ToastsManager } from 'ng2-toastr';
import { UserService } from '../../../../services/user.service';
import { InsightService } from '../../../../services/insights/insight.service';
import { ENV } from '../../../../env.config';
import { NotificationService } from '../../../../services/notifications.service';
declare var $: any;
@Component({
  selector: 'app-admin-preview',
  templateUrl: './admin-preview.component.html',
  styleUrls: ['./admin-preview.component.css']
})
export class AdminPreviewComponent implements OnInit {

  @Input() event: ComposeModel;
  isEdit: boolean;
  insightsData: any;
  insightsData1 = []
  insightsData2 = []
  public id: number;
  private type: any;
  routeSub: Subscription;
  apiEvents = [];
  editorierId : any;
  whenPageLoad: boolean = true;
  finished: boolean = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser')).user;
  currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  submitEventObj: ComposeModel;
  submitting: boolean;
  submitEventSub: Subscription;
  private insightcommentId: number;
  reply: boolean;
  userid: number;
  loading: boolean;
  isPushed: boolean = false;
  submitBtnText: string;
  public serverURL = ENV.SERVER_URL;
  public replyFor = null;

  public showForm={};
  public showComment={};

  objLen: number = 40;
  dtOptions = {
    "draw": 1,
      "order": [
          { "column": "createdAt", "dir": "desc" }
      ],
     "start": 0,

     "length": this.objLen,
  
     };
     error: boolean;
     insightscomments= [];
     switch:string = '';
     onScrollUp() {   
     
      this.dtOptions.start += this.objLen;
      this.finished = false;
      this.getInsightscomments();
      this.finished = true;
    }
  
    public getInsightscomments(append=true) {       
      this._composeapi.getInsightcommentById$(this.id,this.dtOptions).subscribe(data=> {      
         if(data.data.rows.length !== this.objLen){
          
          if(!append)this.insightsData1=[];
            if(data.data.rows.length){
            this.insightsData2 =(data.data.count);
            data.data.rows = this._utils.list_to_tree(data.data.rows);
            this.insightsData1 = (data.data.rows).concat(this.insightsData1);           
          }
          this.finished = true;
         } else {        
          if(data.data.rows.length)this.insightsData1 = (data.data.rows).concat(this.insightsData1);
          if(this.whenPageLoad){
            this.replyFor = ((this.insightsData1).length) ? this.insightsData1[this.insightsData1.length-1].pcid : null;
            this.whenPageLoad = false;
          }      
                 
        }  
 });
}
  constructor(
    private _composeapi: ComposeService,
    private _notificationapi: NotificationService,
    private is: InsightService,
    private route: ActivatedRoute,
    private _utils: UtilsService,
    private _userapi: UserService,
    private fb: FormBuilder,
    private router: Router,
    public toastr: ToastsManager,

  ) { }
  update(editorierId) {

    let obj = {
      'id': this.id,
      'status': 'assigned',
      'editorierId': [editorierId]
    }
    this._composeapi.publishEvent$(obj).subscribe(data => {
      if (data.success === false) {
      } else {
        this.finished = true;
        this.insightsData.status = 'assigned'
      }
    });
  }
  AssignForm: FormGroup = this.fb.group({
    editorierId: [null, Validators.required],
  });

  ngOnInit() {

    this.reply = false;
    this.userid = this._userapi.getCurUserId();
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
      });
     
    let apiEvent = this._composeapi.getComposeById$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.finished = true;
        this.domLoad();
        this.insightsData = data.data;
        this.type = this.insightsData.type;
        if(this.insightsData.status == 'published'){
          this.toastr.success('The insight is already published','sucess')
        }
      }
    });
    this._composeapi.getInsightcommentById$(this.id,this.dtOptions).subscribe(data=> {
    this.loading = true;
    this.finished = true;
    this.getInsightscomments();
      (this.apiEvents).push(apiEvent);  
  
    });
 
  }  
  onNotify(msgRec) {
    this.insightsData1.push(msgRec);
  }

reply1() {
    this.reply = true;
    this.isPushed = true;
  }

  closeAllForms(){
    
    let t = this._utils.objLen(this.showForm);
    if(t){
     for(let k in this.showForm){
      this.showForm[k] = false;
     }
    }
  }


  replyToUpdate(obj={}){        
    this.replyFor = obj['rid'] || this.replyFor;  
   this.closeAllForms();
    this.getInsightscomments(false);   
     this.isPushed = false;
  }
  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    if (res.success) {
      this.toastr.success(res.message, 'Success');
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  };
  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.submitting = false;
    this.error = true;
  };

  submit(data) {
    this.editorierId = data.editorierId;
    let obj = {
      'type': this.type,
      'message': '<a href="/editorier/insights/preview/' + this.insightsData.id + '">' + this.currentUser.first_name + ' ' + this.currentUser.last_name + '(Admin) assigned an insight to Verify / Publish' + '</a>',
      'from': this.currentUserId,
      'to': [data.editorierId]
    }
    this._notificationapi.notification(obj).subscribe(data => {
      if (data.success) {
        this.toastr.success(data.message, 'Success');
        this.update(this.editorierId)
        this.router.navigate(['/admin/insights/my-insights'])
      }
    })

  }
  domLoad() {
    let that = this;
    $(document).ready(function () {
      let select2Obj = $(".js-data-example-ajax").select2({
        minimumInputLength: 2,
        ajax: {
          url: ENV.BASE_API + "auto-search-editoriers?token=" + that.is.getToken(),
          dataType: 'json',
          data: function (params) {
            return {
              p: params.term, // search term
              page: params.page
            };
          },
          processResults: function (data, params) {
            var data = $.map(data, function (obj) {
              obj.id = obj.id;
              obj.text = obj.sku;
              return obj;
            });
            params.page = params.page || 1;

            return {
              results: data,
              pagination: {
                more: (params.page * 30) < data.total_count
              }
            };
          },
          cache: true
        },
        escapeMarkup: function (markup) {
          return markup;
        }, // let our custom formatter work

      });
      select2Obj.on("select2:select", function (e) {
        that.AssignForm.patchValue({ 'editorierId': e.params.data.id });

      });
    });
  }

  switchForm(id){
    this.replyFor = id;
    this.showForm[id] = !this.showForm[id];
  }
  // switchComments(id){
  //   this.showComment[id] = !this.showComment[id];
  //   if(this.showComment[id]){
  //     this._composeapi.getInsightcommentsById$(this.id,{parent:id}).subscribe(data=> {
  //       this.loading = true;
  //       this.finished = true;
  //       this.getInsightscomments();
  //         (this.apiEvents).push(apiEvent);  
      
  //       });
  //   }
  // }

  public ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })

    }

  }

}



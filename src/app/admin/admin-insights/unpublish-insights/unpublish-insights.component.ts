import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpService } from '../../../services/help.service';
import { UtilsService } from '../../../services/utils.service';
import { ToastsManager } from 'ng2-toastr';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { ComposeService } from '../../../services/compose.service';
import { CommodityService } from '../../../services/insights/commodity.service';
import { ClientModel } from '../../../models/client.model';
import { ENV } from '../../../env.config';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unpublish-insights',
  templateUrl: './unpublish-insights.component.html',
  styleUrls: ['./unpublish-insights.component.css']
})
export class UnpublishInsightsComponent implements OnInit {

  public commodities:Array<Object>;
  userprofile: ClientModel;
  private createdBy: number;
  userSub: Subscription;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  loading: boolean = true;
  public noRecords : boolean = true;
  //currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;

  objLen:number = 10;
  dtOptions = { 
    "draw": 1, 
    "columns": [
      { "data": "headline", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "summary", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "description", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "createdBy", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "commodityId", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "tickerId", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      // { "data": "first_name", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      // { "data": "last_name", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      // { "data": "email", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      // { "data": "profile_pic", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "id", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }],
      "order": [
          { "column": "createdAt", "dir": "desc" }
      ],
      "start": 0,
      "length": this.objLen,
      //"currentUserId" :this.currentUserId, 
      "search": { "value": "", "regex": false },
      "where" : { status : { $in : [ENV.INSIGHT_STATUSES.ASSIGNED].concat([ENV.INSIGHT_STATUSES.SUBMITTED])}},
    };
  finished = false  // boolean when end of database is reached
 
  error: boolean;
  apiEvents = [];
  insights= [];
  switch:string = 'grid-item';
  
  probFilterForm: FormGroup = this.fb.group({
    sortBy: ['recent'],
    commodityId: [''],
    quickFilter: [''],
  });

  getCommodities(){
    this.cs.getCommodities().subscribe(data=>{
      this.commodities = data.data;
    });
  }


  constructor(

    private http: HttpClient,
    private _composeService: ComposeService,
    private _utils: UtilsService,
    private router: Router,
    private cs:CommodityService,
    private _userapi: UserService,
    private meta: Meta,
    public toastr: ToastsManager,
    private fb: FormBuilder
  ) {
    this.getCommodities();
   }

   ngOnInit() {
    //let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //this.dtOptions.columns[3].search['value'] = currentUser.user.userid;
    this.getInsights();
    this.onChanges();
  }
  selectCompany(company){
  this.router.navigateByUrl(`/company/`+company )
}
selectUser(id){
  this.router.navigateByUrl(`/profile/`+id )
}
selectTicker(id){
  this.router.navigateByUrl(`/ticker/`+id )
}
  onChanges(){
    this.probFilterForm.valueChanges
              .debounceTime(500)
              .distinctUntilChanged()
              .subscribe(val => {
      this.dtOptions.columns[4].search['value'] = val.commodityId;
      this.dtOptions.search = { "value": val.quickFilter, "regex": false };
      this.dtOptions.order[0].dir = (val.sortBy === 'recent') ? "desc" : 'asc';
      this.dtOptions.start = 0;
      this.dtOptions.length = this.objLen;
      this.finished = false;
      this.insights = [];    
      this.getInsights();
    });
  }

  onScroll () {
    this.dtOptions.start += this.objLen;
    this.getInsights();
  }

  private getInsights(append=true) {
    if (this.finished) return;

    this._composeService
        .filterInsights$(this.dtOptions,'filter-insights')
        .subscribe(data => {   
          this.loading = false;
          if (this.noRecords && data.data.length) {
            this.noRecords = false;
          }        
          if(data.data.length !== this.objLen){
            this.finished = true;
          }
          this.insights = (this.insights).concat(data.data);      
        })        
  }
//   private _getUser() {
//     this.loading = true;
//     // GET event by ID
//     this.userSub = this._userapi
//       .getUserById$(this.createdBy)
    
//       .subscribe(
//       res => {

//         if (res.success) {
//           this.userprofile = res.data;
//           this.avatar = this.serverURL + this.userprofile.profile_pic;
//         }
//         this.loading = false;
//       },
//       err => {
//         this.loading = false;
//         this.error = true;
//       }
//       );
//   }

// }

}

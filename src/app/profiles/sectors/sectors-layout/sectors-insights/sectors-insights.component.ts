import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { ClientModel } from '../../../../models/client.model';
import { Subscription } from 'rxjs';
import { ENV } from '../../../../env.config';
import { ActivatedRoute, Router } from '@angular/router';
import { ComposeService } from '../../../../services/compose.service';
import { UtilsService } from '../../../../services/utils.service';
import { CommodityService } from '../../../../services/insights/commodity.service';
import { Meta } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-sectors-insights',
  templateUrl: './sectors-insights.component.html',
  styleUrls: ['./sectors-insights.component.css']
})
export class SectorsInsightsComponent implements OnInit {
  public commodities:Array<Object>;
  userprofile: ClientModel;
  private createdBy: number;
  userSub: Subscription;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  loading: boolean = true;
  user: boolean = false;
  public id: any;
  public noRecords : boolean = true;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public baseURI = ENV.BASE_URI
  objLen:number = 10;
  private routeSub = this.route.parent.params
  .subscribe(params => {
    this.id = params['id'];
  });
  dtOptions = { 
    "draw": 1, 
    "columns": [
      { "data": "headline", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "summary", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "description", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "createdBy", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "commodityId", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "tickerId", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "id", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }],
      "order": [
          { "column": "createdAt", "dir": "desc" }
      ],
      "start": 0,
      "length": this.objLen,
      "sectorId":[this.id],
      "search": { "value": "", "regex": false },
      "where" : { status : { $in : [ENV.INSIGHT_STATUSES.PUBLISHED]}}
    };
  finished = false  // boolean when end of database is reached
 
  error: boolean;
  apiEvents = [];
  insights= [];
  switch:string = 'list-group-item';
  
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
    private _userapi : UserService,
    private _composeService: ComposeService,
    private _utils: UtilsService,
    private cs:CommodityService,
    private meta: Meta,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    private router : Router,
    private auth: AuthService,
    private route: ActivatedRoute,
  ) {    
    auth.loadSession();
    this.getCommodities();

   }
  //  selectCompany(company){
  //   this.router.navigateByUrl(`/company/`+company )
  // }
  // selectUser(id){
  //   this.router.navigateByUrl(`/profile/`+id )
  // }
  ngOnInit() {
    this.getInsights();
    this.onChanges();
    if (this.currentUser) {
      this.user = true;
    };
  }
  addFollowers(userId: number){
    if(this.currentUser){
      let followerObj = {
        'analyst_id':userId,
        'followedBy':this.currentUser.user.userid
      }
      
    }else{
      this.router.navigate(['/auth/login'])
    }
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
  addwatchlist(id:number, type) {
    let insViewObj = {
      'type': type,
      'type_id':id
    }  
     this._composeService.insightAddwatchlist$(insViewObj)
        .subscribe(
          data =>{ 
            if(data.success){         
            this.toastr.success(data.message,'Success');
            }  
            else{       
              this.toastr.error(data.message,'Invalid');  
            }          
        });  
  }
}

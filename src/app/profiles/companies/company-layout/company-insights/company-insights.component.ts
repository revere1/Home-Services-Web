import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HelpService } from '../../../../services/help.service';
import { UserService } from '../../../../services/user.service';
import { UtilsService } from '../../../../services/utils.service';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { Subscription } from 'rxjs';
import { ClientModel } from '../../../../models/client.model';
import { ENV } from '../../../../env.config';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CommodityService } from '../../../../services/insights/commodity.service';
import { ComposeService } from '../../../../services/compose.service';
import { InsightService } from '../../../../services/insights/insight.service';
import { AuthService } from '../../../../services/auth.service';
import { CompanyService } from '../../../../services/company.service';

@Component({
  selector: 'app-company-insights',
  templateUrl: './company-insights.component.html',
  styleUrls: ['./company-insights.component.css']
})
export class CompanyInsightsComponent implements OnInit,AfterViewInit {
  public commodities: Array<Object>;
  userprofile: ClientModel;
  private createdBy: number;
  userSub: Subscription;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  loading: boolean = true;
  public company: any;
  public noRecords: boolean = true;
  objLen: number = 10;
  public id: any;
  private routeSub = this.route.parent.params
    .subscribe(params => {
      this.company = params['company'];
    });

  dtOptions = {
    "draw": 1,
    "columns": [
      { "data": "headline", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "summary", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "description", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      //{ "data": "createdBy", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "commodityId", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "tickerId", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "id", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }],
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
    "currentUserId": {createdBy:{$in:[]}},
    "search": { "value": "", "regex": false },
    "where": { status: { $in: [ENV.INSIGHT_STATUSES.PUBLISHED] } }
  };
  finished = false  // boolean when end of database is reached

  error: boolean;
  apiEvents = [];
  insights = [];
  switch: string = 'list-group-item';
  companyInsights = [];
  companyId : any;

  probFilterForm: FormGroup = this.fb.group({
    sortBy: ['recent'],
    commodityId: [''],
    quickFilter: [''],
  });

  getCommodities() {
    this.cs.getCommodities().subscribe(data => {
      this.commodities = data.data;
    });
  }
  constructor(
    private http: HttpClient,
    private _insightService: InsightService,
    private route: ActivatedRoute,
    private _companyApi: CompanyService,
    private _composeService: ComposeService,
    private _utils: UtilsService,
    private cs: CommodityService,
    private meta: Meta,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    private auth : AuthService
  ) {
    auth.loadSession();
    this.getCommodities();
  }

  ngAfterViewInit(){
    if(this._utils.detectmob()){
      this.switch='grid-item';
    }
  }

  ngOnInit() {
    this._companyApi.getCompanyByName$(this.company).subscribe(data => {
      if (data.success === false) {
      } else {
        this.companyId = data.data.id;
        //after getting company Id
        this._insightService.getComapanyInsights$(this.companyId).subscribe(data => {
          if (data.success === false) {
          } else {
            this.companyInsights = data.data;
            let usersId = [];
            this.companyInsights.forEach(val => {
              usersId.push(val.id)
            });
            this.dtOptions.currentUserId.createdBy = { $in:usersId }
            this.getInsights();
            this.onChanges(); 
          }
        }); 
      }
    });   
  }

  onChanges() {
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

  onScroll() {
    this.dtOptions.start += this.objLen;
    this.getInsights();
  }

  private getInsights(append = true) {
    if (this.finished) return;

    this._composeService
      .filterInsights$(this.dtOptions, 'filter-insights')
      .subscribe(data => {
        this.loading = false;
        if (this.noRecords && data.data.length) {
          this.noRecords = false;
        }
        if (data.data.length !== this.objLen) {
          this.finished = true;
        }
        this.insights = (this.insights).concat(data.data);
      })
  }
}

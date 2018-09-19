import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ENV } from '../env.config';
import { ClientModel } from '../models/client.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { Meta } from '@angular/platform-browser';
import { CommodityService } from '../services/insights/commodity.service';
import { UtilsService } from '../services/utils.service';
import { ComposeService } from '../services/compose.service';
import { UserService } from '../services/user.service';
import { InsightService } from '../services/insights/insight.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { AuthService } from '../services/auth.service';
import { BreadcrumbsService } from 'ng2-breadcrumbs';


@Component({
  selector: 'app-my-watch-list',
  templateUrl: './my-watch-list.component.html',
  styleUrls: ['./my-watch-list.component.css']
})
export class MyWatchListComponent implements OnInit {

  public commodities: Array<Object>;
  public watchlist: any;
  userprofile: ClientModel;
  private createdBy: number;
  userSub: Subscription;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  loading: boolean = true;
  public noRecords: boolean = true;
  objLen: number = 10;
  public id: any;
  public role: any;
  public show: any = null;
  public hoverIndex: any = null;
  private currentUser = JSON.parse(localStorage.getItem('currentUser'));

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
    "tickerId": [],
    "insightId": [],
    "sectorId": [],
    "currencyId": [],
    "regionId": [],
    "length": this.objLen,
    "currentUserId": { createdBy: { $in: [] } },
    "search": { "value": "", "regex": false },
    "where": { status: { $in: [ENV.INSIGHT_STATUSES.PUBLISHED] } }
  };
  finished = false  // boolean when end of database is reached

  error: boolean;
  apiEvents = [];
  insights = [];
  switch: string = 'grid-item';

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
    private route: ActivatedRoute,
    private _insightService: InsightService,
    private _userapi: UserService,
    private _composeService: ComposeService,
    private _utils: UtilsService,
    private cs: CommodityService,
    private meta: Meta,
    public toastr: ToastsManager,
    private auth: AuthService,
    private breadcrumbsService: BreadcrumbsService,
    private fb: FormBuilder
  ) {
    auth.loadSession();
    this.getCommodities();
  }

  ngOnInit() {
        /*BreadCrumb*/
        let bcList = [
        { label: 'Watchlist', url: 'watch-list', params: [] }];
        this._utils.changeBreadCrumb(bcList);
        this._utils.currentBSource.subscribe(list => {
          this.breadcrumbsService.store(list);
        });
        /*End - BreadCrumb*/
    if (this.currentUser) {
      this._insightService.getWatchedList$(this.currentUser.user.userid).subscribe(data => {
        if (data.success === false) {
        } else {
          this.watchlist = data.data;
          let instypeId = [];
          let tictypeId = [];
          let anatypeId = [];
          let curtypeId = [];
          let regtypeId = [];
          let sectypeId = []
          this.watchlist.forEach(val => {
            if (val.type == 'insight') {
              instypeId.push(val.type_id)
            } else if (val.type == 'ticker') {
              tictypeId.push(val.type_id)
            } else if (val.type == 'analyst') {
              anatypeId.push(val.type_id)
            } else if (val.type == 'sector') {
              sectypeId.push(val.type_id)
            } else if (val.type == 'currency') {
              curtypeId.push(val.type_id)
            } else if (val.type == 'region') {
              regtypeId.push(val.type_id)
            }
          })
          this.dtOptions.currentUserId.createdBy = { $in: anatypeId }
          this.dtOptions.tickerId = tictypeId;
          this.dtOptions.insightId = instypeId;
          this.dtOptions.currencyId = curtypeId;
          this.dtOptions.regionId = regtypeId;
          this.dtOptions.sectorId = sectypeId;
          this.getInsights();
          this.onChanges();
        }
      });
     
    }
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
  enter(i) {
    this.hoverIndex = i;
  }
  leave(i) {
    this.show = null;
    this.hoverIndex = null;
  }
  share(i) {
    this.show = i;
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
      });
  }
}

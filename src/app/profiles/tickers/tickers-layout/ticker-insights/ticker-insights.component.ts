import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HelpService } from '../../../../services/help.service';
import { UserService } from '../../../../services/user.service';
import { UtilsService } from '../../../../services/utils.service';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { Subscription } from 'rxjs';
import { ClientModel } from '../../../../models/client.model';
import { ENV } from '../../../../env.config';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CommodityService } from '../../../../services/insights/commodity.service';
import { ComposeService } from '../../../../services/compose.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-ticker-insights',
  templateUrl: './ticker-insights.component.html',
  styleUrls: ['./ticker-insights.component.css']
})
export class TickerInsightsComponent implements OnInit {

  public commodities: Array<Object>;
  userprofile: ClientModel;
  private createdBy: number;
  userSub: Subscription;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  loading: boolean = true;
  public noRecords: boolean = true;
  objLen: number = 10;
  public id: any;
  // public insightId : any;
  public show: any = null;
  public hoverIndex: any = null;
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
    "tickerId": [this.id],
    // "currentUserId": {createdBy:{$in:[this.id]}},
    "search": { "value": "", "regex": false },
    "where": { status: { $in: [ENV.INSIGHT_STATUSES.PUBLISHED] } }
  };
  finished = false  // boolean when end of database is reached

  error: boolean;
  apiEvents = [];
  insights = [];
  switch: string = 'list-group-item';
  enablePreview: boolean = false;


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
    private router: Router,
    private _composeService: ComposeService,
    private _utils: UtilsService,
    private cs: CommodityService,
    private meta: Meta,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.getCommodities();
    auth.loadSession();
  }

  ngOnInit() {
    this.getInsights();
    this.onChanges();
  }
  // preview(insightId){
  //   this.insightId = insightId;
  //   this.enablePreview = true;
  // }
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
  selectCompany(company){
    this.router.navigateByUrl(`/company/`+company )
  }
  selectUser(id){
    this.router.navigateByUrl(`/profile/`+id )
  }
  selectTicker(id){
    this.router.navigateByUrl(`/ticker/`+id )
  }
  addwatchlist(id: number, type) {
    let insViewObj = {
      'type': type,
      'type_id': id
    }
    this._composeService.insightAddwatchlist$(insViewObj)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success(data.message, 'Success');
          }
          else {
            this.toastr.error(data.message, 'Invalid');
          }
        });
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
          // this.preview(data.data[0].id)
          this.finished = true;
        }
        this.insights = (this.insights).concat(data.data);
      })
  }
}

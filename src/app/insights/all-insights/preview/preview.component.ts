import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ENV } from '../../../env.config';
import { ComposeService } from '../../../services/compose.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notifications.service';
import { FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { ComposeModel } from '../../../models/compose.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Meta } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, AfterViewInit {
  ngxData: any = {};
  submit: boolean;
  @Input() insId: number;
  view: any[] = [1200, 500];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  // line, area
  autoScale = true;
  public price: any;
  public Headers = [];

  private dataRetrived: boolean = false;
  //<-------charts End ---------/>


  @Input() event: ComposeModel;
  isEdit: boolean;
  insightsData: any;
  public id: number;
  private type: any;
  routeSub: Subscription;
  apiEvents = [];
  finished: boolean = false;
  submitEventObj: ComposeModel;
  submitting: boolean;
  submitEventSub: Subscription;
  error: boolean;
  public serverURL = ENV.SERVER_URL;
  public baseURI = ENV.BASE_URI
  submitBtnText: string;
  public replyFor = null;
  public showForm = {};
  public showComment = {};
  reply: boolean;
  isPushed: boolean = false;
  insightsData1 = []
  insightsData2 = [];
  user: boolean = false;
  loading: boolean;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  whenPageLoad: boolean = true;
  public viewsCount: any;
  public commentsCount: any;
  objLen: number = 40;
  public rating=0;
  dtOptions = {
    "draw": 1,
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
  };

  insightscomments = [];
  switch: string = '';
  onScrollUp() {
    this.dtOptions.start += this.objLen;
    this.finished = false;
    this.getInsightscomments();
    this.finished = true;
  }
  public getInsightscomments(append = true) {
    this._composeapi.getInsightcommentById$(this.id, this.dtOptions).subscribe(data => {
      if (data.data.rows.length !== this.objLen) {
        if (!append) this.insightsData1 = [];
        if (data.data.rows.length) {
          this.commentsCount = (data.data.count);
          data.data.rows = this._utils.list_to_tree(data.data.rows);
          this.insightsData1 = (data.data.rows).concat(this.insightsData1);
        }
        this.finished = true;
      } else {
        if (data.data.rows.length) this.insightsData1 = (data.data.rows).concat(this.insightsData1);
        if (this.whenPageLoad) {
          this.replyFor = ((this.insightsData1).length) ? this.insightsData1[this.insightsData1.length - 1].pcid : null;
          this.whenPageLoad = false;
        }
      }
    });
  }
  constructor(
    private datePipe: DatePipe,
    private dashbrdService: DashboardService,
    private _composeapi: ComposeService,
    private route: ActivatedRoute,
    private _utils: UtilsService,
    private breadcrumbsService: BreadcrumbsService,
    private fb: FormBuilder,
    private router: Router,
    public toastr: ToastsManager,
    private auth: AuthService,
    private meta: Meta
  ) {
    // this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    // this.meta.updateTag({ name: 'twitter:site', content: '@revere' });
    // this.meta.updateTag({ property: 'og:url', content: 'http://ec2-35-178-115-252.eu-west-2.compute.amazonaws.com/insights/preview/23' });
    // this.meta.updateTag({ property: 'og:title', content: 'EASTW: Water Monopoly to Ride Wave of Growth Along Eastern Seaboard : Reveressss' });
    // this.meta.updateTag({ property: 'og:description', content: 'PTT Wants to Build Your Next Train! Intuitively speaking, the national oil company isnt the first company that comes to mind when Thailand needs a new train, but that didnt stop PTT Group from sending two of their subsidiaries'});
    // this.meta.updateTag({ property: 'og:image', content: 'http://ec2-35-178-115-252.eu-west-2.compute.amazonaws.com:1332/summary-note-images/2855f9d349d156ee296c235119b339cc-g1.png' });
    auth.loadSession();
  }
  public loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
  ngOnInit() {
    /*BreadCrumb*/
    let bcList = [{ label: 'Home', url: 'home', params: [] },
    { label: 'Insights', url: '/insights', params: [] },
    { label: 'Preview', url: 'preview', params: [] }];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
    this.init();
  }
  init() {
    this.ngxData = {
      data: [
        {
          name: 'api',
          series: []
        }
      ]
    }
    this.routeSub = this.route.params
      .subscribe(params => {
        if (params['id'] != undefined) {
          this.id = params['id'];
        } else {
          this.id = this.insId;
        }
      });
    if (this.currentUser) {
      this.user = true;

      let ratingObj = {
        'insightId': this.id,
        'userId': this.currentUser.user.userid
      }
      this._composeapi.getInsightRating(ratingObj).subscribe(data => {
        if (data.success === true) {
          this.rating = data.rating
        }
      });
    };
    
    this._composeapi.insightViewsCount$(this.id).subscribe(data => {
      if (data.success === false) {
        this.viewsCount = data.count
      }
    });

   
    let apiEvent = this._composeapi.getComposeById$(this.id).subscribe(data => {
      if (data.success === false) {
        this.router.navigate(['/insights'])
      } else {
        this.finished = true;
        this.dataRetrived = true;
        this.insightsData = data.data;
        if (this.insightsData.ticker != null) {
          this.loadData();
        }
        this.type = this.insightsData.type;

        let imgUrls = this._utils.extractImgs(this.insightsData.summary);
        let img = imgUrls.length ? imgUrls[0] : ENV.BASE_URI + 'assets/img/revere-logo.png';
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:site', content: '@revere' });
        this.meta.updateTag({ property: 'og:type', content: 'article' });
        this.meta.updateTag({ property: 'og:url', content: ENV.BASE_URI + '/insights/preview/' + this.insightsData.id });
        this.meta.updateTag({ property: 'og:title', content: this.insightsData.headline });
        this.meta.updateTag({ property: 'og:description', content: this._utils.getFewWords(this._utils.stripTags(this.insightsData.summary), 30) });
        this.meta.updateTag({ property: 'og:image', content: img });
        this.meta.updateTag({ property: 'og:image:width', content: "930" });
        this.meta.updateTag({ property: 'og:image:height', content: "670" });
        if (this.currentUser && this.currentUser.user.access_level === 2) {
          let insViewObj = {
            'insightId': this.insightsData.id,
            'viewedBy': this.currentUser.user.userid
          }
          this._composeapi.insightView$(insViewObj).subscribe(data => {
            if (data.success === false) {
            }
          })
        }
      }
    });
    (this.apiEvents).push(apiEvent);
    this.getInsightscomments();
  }
  loadData() {
    this.submit = true;
    this.dashbrdService.fetchData(this.insightsData.ticker.name).subscribe(data => {
      if (data.dataset.data.length) {
        this.price = data.dataset.data[0][4];
        data.dataset.data.reverse();
        for (let c = 0; c < data.dataset.data.length; c++) {
          if (c) {
            this.ngxData.data[0].series.push({ name: (data.dataset.data[c - 1][0].split('-')[1] === data.dataset.data[c][0].split('-')[1]) ? ' '.repeat(c) : this.datePipe.transform(data.dataset.data[c][0], "MMM-yy"), value: data.dataset.data[c][4] });
          }
          else {
            this.ngxData.data[0].series.push({ name: this.datePipe.transform(data.dataset.data[c][0], "MMM-yy"), value: data.dataset.data[c][4] });
          }
        }
        this.submit = false;
      }
      this.loadScript('./assets/js/scripts.js');
    }, (err) => {
      this.submit = false;
    });
  }
  addwatchlist(id: number, type) {
    let insViewObj = {
      'type': type,
      'type_id': id
    }
    this._composeapi.insightAddwatchlist$(insViewObj)
      .subscribe(data => {
        if (data.success) {
          this.toastr.success(data.message, 'Success');
        }
        else {
          this.toastr.error(data.message, 'Invalid');
        }
      });
  }
  selectUser(id) {
    this.router.navigateByUrl(`/profile/` + id)
  }
  reply1() {
    this.reply = true;
    this.isPushed = true;
  }
  closeAllForms() {
    let t = this._utils.objLen(this.showForm);
    if (t) {
      for (let k in this.showForm) {
        this.showForm[k] = false;
      }
    }
  }
  replyToUpdate(obj = {}) {
    this.replyFor = obj['rid'] || this.replyFor;
    this.closeAllForms();
    this.getInsightscomments(false);
    this.isPushed = false;
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
  switchForm(id) {
    this.replyFor = id;
    this.showForm[id] = !this.showForm[id];
  }
  switchComments(id) {
    this.showComment[id] = !this.showComment[id];
    if (this.showComment[id]) {
      this._composeapi.getInsightcommentsById$(this.id, { parent: id }).subscribe(data => {
        this.loading = true;
        this.finished = true;
        this.getInsightscomments();
        // (this.apiEvents).push(apiEvent);  

      });
    }
  }
  ngAfterViewInit() {
    let that = this;
    setTimeout(function () {
      $(`#data h3`).each(function (index) {
        that.Headers[index] = $(this).text();
      });
      setTimeout(function () {
        $(`#data h3`).each(function (index) {
          $("p#header" + index).click(function () {
            $('html, body').animate({
              scrollTop: $("#data h3").eq(index).offset().top - ($('#fixed-top-header').height() + 20)
            }, 100);
          });
        });
      }, 200);
    }, 1000);
  }
  public ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }

  public clientRating(){
    
    let ratingObj = {
      'insightId': this.id,
      'userId': this.currentUser.user.userid,
      'rating':this.rating
    }
    this._composeapi.addInsightRating(ratingObj)
      .subscribe(data => {
        if (data.success) {
          this.toastr.success(data.message, 'Success');
        }
        else {
          this.toastr.error(data.message, 'Invalid');
        }
      });
  }
}

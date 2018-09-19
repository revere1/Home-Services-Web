import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NguCarousel, NguCarouselStore, NguCarouselConfig } from '../carousel';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsightService } from '../services/insights/insight.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { ComposeService } from '../services/compose.service';
import { UtilsService } from '../services/utils.service';
import { CommodityService } from '../services/insights/commodity.service';
import { Meta } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr';
import { ClientModel } from '../models/client.model';
import { Subscription } from 'rxjs/Subscription';
import { ENV } from '../env.config';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

declare var $: any;
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public commodities: Array<Object>;
  public latestInsights: any;
  public researchlistInsights: any;
  userprofile: ClientModel;
  private createdBy: number;
  userSub: Subscription;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  loading: boolean;
  public noRecords: boolean = true;
  objLen: number = 10;
  public id: any;
  public role: any;
  public show: any = null;
  public hoverIndex: any = null;
  private currentUser = JSON.parse(localStorage.getItem('currentUser')).user

  storeCarouselData: NguCarouselStore;
  rsts: any;
  stateCtrl: FormControl;
  states: { name: string; img: string }[];
  imgags: string[];
  public carouselBannerItems: Array<any> = [];
  public carouselBanner: NguCarouselConfig;

  public carouselTileItems: Array<any> = [];
  public carouselTile: NguCarouselConfig;

  public carouselTileOneItems: Array<any> = [];
  public carouselTileOne: NguCarouselConfig;

  public carouselTileTwoItems: Array<any> = [];
  public carouselTileTwo: NguCarouselConfig;
  indexr = 0;
  public privillages: any;
  public privillageType: any;
  @ViewChild('mybanners') mybanners: NguCarousel;
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
    "currentUserId": { createdBy: { $in: [] } },
    "search": { "value": "", "regex": false },
    "where": { status: { $in: [ENV.INSIGHT_STATUSES.PUBLISHED] } }
  };

  finished = false  // boolean when end of database is reached

  error: boolean;
  apiEvents = [];
  insights = [];
  switch: string = 'list-group-item';

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
    private _insightApi: InsightService,
    private _userapi: UserService,
    private _composeService: ComposeService,
    private _utils: UtilsService,
    private cs: CommodityService,
    private meta: Meta,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.getCommodities();
  }

  selectUser(id) {
    this.router.navigateByUrl(`/profile/` + id)
  }
  ngOnInit() {


    this._insightApi.getNewInsights$().subscribe(data => {
      if (data.success == false) {

      } else {
        this.latestInsights = data.data;
      }
    })

    this._insightApi.getResearchInsightUsers$().subscribe(data => {
      if (data.success == false) {

      } else {
        this.researchlistInsights = data.data;
        console.log(this.researchlistInsights[0].insight_img)
      }
    })
    this._insightApi.getPrivillagesUsers$(this.currentUser.userid).subscribe(data => {
      if (data.success == false) {
      }
      else {
        this.privillages = data.data;
        this.privillageType = this.privillages[0].privillege;
      }
      this.scrmenu();
    })

 

    this.carouselBanner = {
      grid: { xs: 1, sm: 2, md: 2, lg: 2, all: 0 },
      slide: 4,
      speed: 500,
      loop: true,
      // interval: 4000,
      point: {
        visible: true,
        pointStyles: `
          .ngucarouselPoint {
            list-style-type: none;
            text-align: justify !important;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 100%;
            bottom: 20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngucarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.55);
            padding: 5px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngucarouselPoint li.active {
              background: white;
              width: 10px;
          }
        `
      },
      load: 2,
      custom: 'banner',
      touch: true,
      easing: 'cubic-bezier(0, 0, 0.2, 1)',
      RTL: true,
      vertical: { enabled: true, height: 400 }
    };

    this.carouselTile = {
      grid: { xs: 2, sm: 3, md: 3, lg: 4, all: 0 },
      speed: 600,
      interval: 3000,
      point: {
        visible: true,
        pointStyles: `
          .ngucarouselPoint {
            list-style-type: none;
            text-align: justify !important;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            box-sizing: border-box;
          }
          .ngucarouselPoint li {
            display: inline-block;
            border-radius: 50%;
            border: 2px solid rgba(0, 0, 0, 0.55);
            padding: 4px;
            margin: 0 3px;
            transition-timing-function: cubic-bezier(.17, .67, .83, .67);
            transition: .4s;
          }
          .ngucarouselPoint li.active {
              background: #6b6b6b;
              transform: scale(1.2);
          }
        `
      },
      load: 2,
      touch: true,
      RTL: true
    };

    this.carouselTile = {
      grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
      slide: 1,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: true,
        pointStyles: `.ngucarouselPoint { list-style-type: none; text-align: justify !important; padding: 12px; margin: 0; white-space: nowrap;
                        overflow: auto; position: absolute; width: 100%; top: 0; box-sizing: border-box; }
                      .ngucarouselPoint li { display: inline-block; border-radius: 999px; background: #444444; width: 10px;
                        height: 10px; padding: 5px; margin: 2.5px 3px; transition: .2s ease all; }
                      .ngucarouselPoint li.active { background: white; width: 15px; height: 15px;
                        margin: 0px 3px; border: 0.5px solid #444444; }`
      },
      load: 2,
      touch: true,
      easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };

    this.carouselTileOne = {
      grid: { xs: 2, sm: 3, md: 4, lg: 4, all: 0 },
      speed: 600,
      point: {
        visible: true,
        pointStyles: `
          .ngucarouselPoint {
            list-style-type: none;
            text-align: justify !important;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            box-sizing: border-box;
          }
          .ngucarouselPoint li {
            display: inline-block;
            border-radius: 50%;
            background: #6b6b6b;
            padding: 5px;
            margin: 0 3px;
            transition: .4s;
          }
          .ngucarouselPoint li.active {
              border: 2px solid rgba(0, 0, 0, 0.55);
              transform: scale(1.2);
              background: transparent;
            }
        `
      },
      load: 2,
      loop: true,
      touch: true,
      easing: 'ease',
      animation: 'lazy'
    };

    this.carouselTileTwo = {
      grid: { xs: 1, sm: 3, md: 4, lg: 4, all: 0 },
      speed: 600,
      interval: 3000,
      point: {
        visible: true
      },
      load: 2,
      touch: true
    };

    this.stateCtrl = new FormControl();
  }

  onScrolll(event) {

    var scrollPos = $(document).scrollTop();
    $('#menu-center a').each(function () {
      var currLink = $(this);
      var refElement = $(currLink.attr("href"));
      if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
        $('#menu-center ul li a').removeClass("active");
        currLink.addClass("active");
      }
      else {
        currLink.removeClass("active");
      }
    });
  }


  scrmenu() {

    let that = this;
    $(document).ready(function () {
      $(document).on("scroll", that.onScrolll);

      //smoothscroll
      $(' a[href^="#"]:not([href="#"])').click(function (e) {
        e.preventDefault();
        $(document).off("scroll");
        $('a').each(function () {
          $(this).removeClass('active');
        })
        $(this).addClass('active');
        var target = $(this.hash),
          menu = target;
        let $target = $(target);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top - 190
          }, 500, 'swing', function () {
            $(document).on("scroll", that.onScrolll);
          });
          return false;
        }

      });
    });

  }

  ngAfterViewInit() {

    this.scrmenu();
  }
getCarouselData(ent) {
    this.storeCarouselData = ent;
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
private getInsights(append = true) {
    if (this.finished) return;

    this._composeService
      .filterInsights$(this.dtOptions, 'filter-insights')
      .subscribe(data => {
        if (this.noRecords && data.data.length) {
          this.noRecords = false;
        }
        if (data.data.length !== this.objLen) {
          this.finished = true;
        }
        this.insights = (this.insights).concat(data.data);
      })
  }
  moveButton1() {
    this.indexr++;
    this.mybanners.moveTo(this.indexr);
  }

  moveButton() {
    this.mybanners.reset();
  }

  onMoveData(data) {
  }
  // filterStates(name: string) {
  //   return this.states.filter(
  //     state => state.name.toLowerCase().indexOf(name.toLowerCase()) === 0
  //   );
  // }
}


import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HelpService } from '../../../services/help.service';
import { UtilsService } from '../../../services/utils.service';
import { HelpModel } from '../../../models/help.model';
import { ToastsManager } from 'ng2-toastr';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { ClientModel } from '../../../models/client.model';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { UserService } from '../../../services/user.service';
import { ENV } from '../../../env.config';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { BreadcrumbsService } from 'ng2-breadcrumbs';


declare var $: any;

// $(document).puitooltip();
@Component({
  selector: 'app-help-comments-list',
  templateUrl: './help-comments-list.component.html',
  styleUrls: ['./help-comments-list.component.css']
  
})
export class HelpCommentsListComponent implements OnInit {


  userSub: Subscription;
  routeSub: Subscription;
  private id: number;
  userprofile: ClientModel;
  currentUserId = JSON.parse(localStorage.getItem('currentUser')).user.userid;
  private createdBy: number;

  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  loading: boolean = true;
  public noRecords: boolean = true;
  objLen: number = 10;
  dtOptions = {
    "draw": 1,
    "columns": [
      { "data": "subject", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "status", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "first_name", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "last_name", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } },
      { "data": "id", "name": "", "searchable": true, "orderable": true, "search": { "value": "", "regex": false } }],
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
    "currentUserId": this.currentUserId,
    "search": { "value": "", "regex": false }
  };
  finished = false  // boolean when end of database is reached

  error: boolean;
  apiEvents = [];
  problems = [];

  switch: string = 'grid-item';

  probFilterForm: FormGroup = this.fb.group({
    sortBy: ['recent'],
    status: [''],
    quickFilter: [''],
  });


  filesToUpload: Array<File>;
  @ViewChild('fileInput') fileInput;
  problemsData1 = []
  problemsData: string

  constructor(

    private http: HttpClient,
    private router : Router,
    private _helpService: HelpService,
    private _userapi: UserService,
    private _utils: UtilsService,
    private meta: Meta,
    private route: ActivatedRoute,

    public toastr: ToastsManager,
    private fb: FormBuilder,
    private breadcrumbsService:BreadcrumbsService

  ) { }
  ngOnInit() {
    
    /*BreadCrumb*/
    let bcList = [{label: 'Home' , url: 'home', params: []},
      {label: 'Help' , url: 'help', params: []}];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
    
    this.getProblems();
    this.onChanges();
    this.createdBy = this._userapi.getCurUserId();

    // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // this.currentUserId = currentUser.user.userid;
    this._getUser();

    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];

      });

  }




  onChanges() {
    this.probFilterForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        this.dtOptions.columns[1].search['value'] = val.status;
        this.dtOptions.search = { "value": val.quickFilter, "regex": false };
        this.dtOptions.order[0].dir = (val.sortBy === 'recent') ? "desc" : 'asc';
        this.dtOptions.start = 0;
        this.dtOptions.length = this.objLen;
        this.finished = false;
        this.problems = [];
        this.getProblems();
      });
  }

  onScroll() {
    this.dtOptions.start += this.objLen;
    this.getProblems();
  }
  selectCompany(company){
    this.router.navigateByUrl(`/company/`+company )
  }
  selectUser(id){
    this.router.navigateByUrl(`/profile/`+id )
  }
  private getProblems(append = true) {
    if (this.finished) return;
    this._helpService
      .filterProblems$(this.dtOptions, 'filter-problems')
      .subscribe(data => {
        if (this.noRecords && data.data.length) {
          this.noRecords = false;
        }
        if (data.data.length !== this.objLen) {
          this.finished = true;
        }
        this.problems = (this.problems).concat(data.data);
      })
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    this._helpService.problemsCount$(currentUser.user.userid, ).subscribe(data => {
      if (data.success === false) {
      } else {
        this.problemsData = data.data
      }
    });
  }
  private _getUser() {
    this.loading = false;
    // GET event by ID
    this.userSub = this._userapi
      .getUserById$(this.createdBy)
      .subscribe(
        res => {
          if (res.success) {
            this.userprofile = res.data;
            this.avatar = this.serverURL + this.userprofile.profile_pic;
          }
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.error = true;
        }
      );
  }
}

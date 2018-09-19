import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HelpService } from '../../../services/help.service';
import { UtilsService } from '../../../services/utils.service';
import { Meta } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ENV } from '../../../env.config';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { ClientModel } from '../../../models/client.model';
import { HelpModel } from '../../../models/help.model';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BreadcrumbsService } from 'ng2-breadcrumbs';

@Component({
  selector: 'app-help-comment-view',
  templateUrl: './help-comment-view.component.html',
  styleUrls: ['./help-comment-view.component.css']
})
export class HelpCommentViewComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  disableScrollDown = false
  routeSub: Subscription;
  private id: number;
  userSub: Subscription;
  userprofile: ClientModel;
  problem_files: HelpModel;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  public files: string = null;
  loading: boolean;
  whenPageLoad: boolean = true;
  finished: boolean = false;
  private problemId: number;
  reply: boolean;
  problemsData: any;
  problemsData4: string;
  problemsData1 = []
  problemsData2 = []
  public replyFor = null;
  userid: number;
  isPushed: boolean = false;
  apiEvents = [];
  objLen: number = 10;
  dtOptions = {
    "draw": 1,
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen,
  };

  // boolean when end of database is reached
  error: boolean;
  problemscomments = [];
  switch: string = '';
  onScrollUp() {
    this.dtOptions.start += this.objLen;
    this.finished = false;
    this.getProblemscomments();
    this.finished = true;
  }

  public getProblemscomments(append = true) {
    //this._helpService.updateAllUnread(this.id,this._helpService.getUserId()).subscribe(data=>{});
    this._helpService.getHelpcommentById$(this.id, this.dtOptions).subscribe(data => {
      if (data.data.length !== this.objLen) {
        data.data.reverse();
        if (data.data.length && (!this.problemsData1.length)) {
          this.problemsData1 = (data.data).concat(this.problemsData1);
        }
        this.finished = true;
      } else {
        data.data.reverse();
        if (data.data.length) this.problemsData1 = (data.data).concat(this.problemsData1);
        if (this.whenPageLoad) {
          this.replyFor = ((this.problemsData1).length) ? this.problemsData1[this.problemsData1.length - 1].pcid : null;
          this.whenPageLoad = false;
        }
      }
    });
  }
  constructor(
    private _helpService: HelpService,
    private _utils: UtilsService,
    private _userapi: UserService,
    private meta: Meta,
    public toastr: ToastsManager,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbsService:BreadcrumbsService
  ) { }

  ngAfterViewChecked() {
    //this.scrollToBottom();        
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  ngOnInit() {
 
        /*BreadCrumb*/
        let bcList = [{label: 'Home' , url: 'home', params: []},
        {label: 'Help' , url: 'help', params: []}, {label: 'Read' , url: 'read', params: []}];
      this._utils.changeBreadCrumb(bcList);
      this._utils.currentBSource.subscribe(list => {
        this.breadcrumbsService.store(list);
      });
      /*End - BreadCrumb*/
    this.reply = false;
    this.userid = this._userapi.getCurUserId();
    // this._getUser();
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this.problemId = params['problemId'];
      });

    //Fetch Messages based on Id
    let apiEvent = this._helpService.getHelpById$(this.id).subscribe(data => {
      if (!data.data.length) {
        this.router.navigateByUrl('/admin/help');
      } else {
        this.problemsData = data.data;
      }
    });

    this._helpService.updateAllUnread(this.id, this._helpService.getUserId()).subscribe(data => { });
    this.loading = true;
    this.finished = true;
    this.getProblemscomments();
    /*
    this._helpService.getHelpcommentById$().subscribe(data => {
        if (data.success === false) {
        } else {
          this.problemsData1 = data.data;
          //this.replyFor = ((this.problemsData1).length) ? this.problemsData1[(this.problemsData1).length-1].pcid : null;
        }
      });*/
    (this.apiEvents).push(apiEvent);


  }

  onNotify(msgRec) {

    this.problemsData1.push(msgRec);
  }

  reply1() {
    this.reply = true;
    this.isPushed = true;
  }


  replyToUpdate(obj) {
    this.replyFor = obj.rid;
    this.problemsData1.push(obj.newComment);
    this.reply = this.isPushed = false;
  }
  public ngonDestory() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }
}

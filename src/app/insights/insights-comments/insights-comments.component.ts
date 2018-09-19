import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { UserService } from '../../services/user.service';
import { ComposeService } from '../../services/compose.service';
import { ENV } from '../../env.config';
@Component({
  selector: 'app-insights-comments',
  templateUrl: './insights-comments.component.html',
  styleUrls: ['./insights-comments.component.css']
})
export class InsightsCommentsComponent implements OnInit {

  @Input('data') comment: any;
  id: number;
  routeSub: any;
  loading: boolean = false;
  finished: boolean = true;
  public comments = [];
  public serverURL = ENV.SERVER_URL;
  public showForm = {};
  public replyFor = null;
  chg = false;
  insightsData1 = []
  insightsData2 = []
  whenPageLoad: boolean = true;
  isPushed: boolean = false;
  objLen: number = 40;
  dtOptions = {
    "draw": 1,
    "order": [
      { "column": "createdAt", "dir": "desc" }
    ],
    "start": 0,
    "length": this.objLen
  };
  @Output() UpdateComments: EventEmitter<any> = new EventEmitter<any>();
  @Output() SelfUpdateComment: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _composeapi: ComposeService,
    private route: ActivatedRoute,
    private _utils: UtilsService,
    private _userapi: UserService
  ) {
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
      });
  }

  ngOnInit() {
    this.chg = true;
  }
  switchForm(id) {
    this.replyFor = id;
    this.showForm[id] = !this.showForm[id];
  }
  replyToUpdate(obj) {
    this.showForm[this.replyFor] = !this.showForm[this.replyFor];
    this.SelfUpdateComment.emit({ 'rid': this.replyFor });
    this.UpdateComments.emit({ 'rid': this.replyFor });
    this.isPushed = false;
  }
  selfUpdate(obj) {
    this.showForm[this.replyFor] = !this.showForm[this.replyFor];
    this.SelfUpdateComment.emit({ 'rid': this.replyFor });
    this.UpdateComments.emit({ 'rid': this.replyFor });
    this.isPushed = false;
  }
}


import { Component, OnInit } from '@angular/core';
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
import { InsightService } from '../../../../services/insights/insight.service';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})


export class UsersOverviewComponent implements OnInit {
  private currentUser = JSON.parse(localStorage.getItem('currentUser'))
  public user: any;
  public commodities: Array<Object>;
  public serverURL = ENV.SERVER_URL;
  public avatar: string = null;
  finished = false  // boolean when end of database is reached
  public insights = [];
  private routeSub:any;
  public id:any;
  switch:string = 'list-group-item';
  constructor(
    private http: HttpClient,
    private _userapi: UserService,
    private route : ActivatedRoute,
    private _insightService: InsightService,
    public _utils: UtilsService,
    private cs: CommodityService,
    private meta: Meta,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    private auth : AuthService
  ) {   
      auth.loadSession();  
    this.getCommodities();
  }

  ngOnInit() {
    this.routeSub = this.route.params
    .subscribe(params => {
      this.id = params['id'];
    });
      this._userapi.getUserById$(this.id).subscribe(data => {
        if (data.success === false) {
        } else {
          this.user = data.data;
        }
      });
      this._insightService.getInsights$(this.id).subscribe(data => {
        if (data.success === false) {
        } else {
          this.insights = data.data;          
        }
      });
  }

  getCommodities() {
    this.cs.getCommodities().subscribe(data => {
      this.commodities = data.data;
    });
  }
}

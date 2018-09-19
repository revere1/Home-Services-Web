import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CompanyService } from '../../../services/company.service';
import { ENV } from '../../../env.config';
import { InsightService } from '../../../services/insights/insight.service';

@Component({
  selector: 'app-company-layout',
  templateUrl: './company-layout.component.html',
  styleUrls: ['./company-layout.component.css']
})
export class CompanyLayoutComponent implements OnInit {
  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public user: any;
  private routeSub: any;
  public id: any;
  public companyId : any;
  public company: any;
  public role: any;
  public companyDetails: any;
  private companyInsights : any;
  public viewCount : any;
  public insCount : any;
  public serverURL = ENV.SERVER_URL;
  public followersCount :any;
  constructor(private _userapi: UserService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private _companyApi: CompanyService,
    private _insightApi : InsightService) {
    auth.loadSession();
  }

  ngOnInit() {
    this.routeSub = this.route.params
      .subscribe(params => {
        this.company = params['company'];
      });
    this._companyApi.getCompanyByName$(this.company).subscribe(data => {
      if (data.success === false) {
      } else {
        this.companyDetails = data.data;
        this.companyId =  this.companyDetails.id;
        //company ins and view count 
        this._insightApi.companyInsightsCount$(this.companyId).subscribe(data => {
          if (data.success === false) {
          } else {
            this.companyInsights = data.data;
            this.viewCount = (this.companyInsights.insights_view)?this.companyInsights.insights_view.viewCount : 0;
            this.insCount = (this.companyInsights.insCount)?this.companyInsights.insCount : 0;
          }
        });
      }
    });
    this._insightApi.companyFollowersCount$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.followersCount = data.data;
      }
    });
  }
}

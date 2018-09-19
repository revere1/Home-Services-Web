import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InsightService } from '../../../../services/insights/insight.service';
import { UtilsService } from '../../../../services/utils.service';
import { AuthService } from '../../../../services/auth.service';
import { CompanyService } from '../../../../services/company.service';
import { ENV } from '../../../../env.config';

@Component({
  selector: 'app-company-overview',
  templateUrl: './company-overview.component.html',
  styleUrls: ['./company-overview.component.css']
})
export class CompanyOverviewComponent implements OnInit {
  private routeSub: any;
  public id: any;
  public company: any;
  public insights: any;
  private companyId: any;
  public serverURL = ENV.SERVER_URL;
  public companydetails: any;
  switch: string = 'list-group-item';
  constructor(private route: ActivatedRoute,
    private _insightService: InsightService,
    public _utils: UtilsService,
    private auth: AuthService,
    private _companyApi: CompanyService) {
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
        this.companyId = data.data.id;
        this.companydetails = data.data;
        //after getting company id
        this._insightService.getLatestComapanyInsights$(this.companyId).subscribe(data => {
          if (data.success === false) {
          } else {
            this.insights = data.data;
          }
        });
      }
    });
  }
}

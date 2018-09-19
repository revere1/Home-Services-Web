import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { formatLabel } from '@swimlane/ngx-charts';
import { ActivatedRoute } from '@angular/router';
import { InsightService } from '../../../../services/insights/insight.service';
import { CompanyService } from '../../../../services/company.service';

@Component({
  selector: 'app-company-statistics',
  templateUrl: './company-statistics.component.html',
  styleUrls: ['./company-statistics.component.css']
})
export class CompanyStatisticsComponent implements OnInit {
  showLabels = false;
  explodeSlices = false;
  doughnut = true;
  arcWidth = 0.5;
  view: any[] = [500, 300];
  colorScheme = {
    domain: ['#FBB040', '#D1D3D4', '#00AEEf', '#F15A29', '#b6e9ef', '#efdda7']
  };
  showLegend = true;
  legendTitle = '';
  gradient = false;
  tooltipDisabled = false;
  submitting: boolean;
  submit: boolean;
  public single = [];
  public multi = [];
  public verticalInsights = [];
  private routeSub: any;
  public company: any;
  public sectorDisIns = [];
  private companyId : any;
  constructor(private _insightService: InsightService,
    private route: ActivatedRoute,
    private _companyApi: CompanyService,
    private auth:AuthService) {
      auth.loadSession();
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params
      .subscribe(params => {
        this.company = params['company'];
      });
    this._companyApi.getCompanyByName$(this.company).subscribe(data => {
      if (data.success === false) {
      } else {
        this.companyId = data.data.id;
        // getting sectordistribution of a company after geeting companyId based on companyname
        this._insightService.getCompInsightsForSectorDist$(this.companyId).subscribe(data => {
          if (data.success === false) {
          } else {
            this.sectorDisIns = data.data;
            let final1 = {};
            for (let i = 0; i < this.sectorDisIns.length; i++) {
              let temporary = {};
              if(this.sectorDisIns[i].ticker != null)
              {
                temporary[i] = this.sectorDisIns[i].ticker.sector.name;
                if (final1[this.sectorDisIns[i].ticker.sector.name] !== undefined)
                Object.assign(final1[this.sectorDisIns[i].ticker.sector.name], temporary)
              else
                final1[this.sectorDisIns[i].ticker.sector.name] = temporary;
              }else{
                temporary[i] = this.sectorDisIns[i].sector.name;
                if (final1[this.sectorDisIns[i].sector.name] !== undefined)
                Object.assign(final1[this.sectorDisIns[i].sector.name], temporary)
              else
                final1[this.sectorDisIns[i].sector.name] = temporary;
              }
            }
            for (var key in final1) {
              this.submit = true;
              this.multi.push({ 'name': key, 'value': ((Object.keys(final1[key]).length)/this.sectorDisIns.length)*100 });
            }
          }
        });
         // getting vertical distribution of a company after geeting companyId based on companyname
      this._insightService.getCompInsightsForVertical$(this.companyId).subscribe(data => {
        if (data.success === false) {
        } else {
          this.verticalInsights = data.data;
          let final = {};
          for (let i = 0; i < this.verticalInsights.length; i++) {
            let temporary = {};
            temporary[i] = this.verticalInsights[i].commodity.name;
            if (final[this.verticalInsights[i].commodity.name] !== undefined)
              Object.assign(final[this.verticalInsights[i].commodity.name], temporary)
            else
              final[this.verticalInsights[i].commodity.name] = temporary;
          }
          for (var key in final) {
            this.submitting = true;
            this.single.push({ 'name': key, 'value': ((Object.keys(final[key]).length)/this.verticalInsights.length)*100 });
          }
        }
      });
      }
    })
  }
  pieTooltipText({ data }) {
    const label = formatLabel(data.name);
    const val = formatLabel(data.value);

    return `
      <span class="tooltip-label">${label}</span>
      <span class="tooltip-val">${val}%</span>
    `;
  }
}

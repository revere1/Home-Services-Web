import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyLayoutComponent } from './company-layout/company-layout.component';
import { CompanyAboutComponent } from './company-layout/company-about/company-about.component';
import { CompanyStatisticsComponent } from './company-layout/company-statistics/company-statistics.component';
import { CompanyInsightsComponent } from './company-layout/company-insights/company-insights.component';
import { CompanyTeamComponent } from './company-layout/company-team/company-team.component';
import { CompanyOverviewComponent } from './company-layout/company-overview/company-overview.component';


const routes: Routes = [
  {path:'',component:CompanyLayoutComponent,
  children: [
    { path: 'overview', component: CompanyOverviewComponent },
    {
      path: 'about', component: CompanyAboutComponent,
      data: {
        breadcrumb: 'About'
      }
    },
    {
      path: 'statistics', component:CompanyStatisticsComponent ,
      data: {
        breadcrumb: 'Statistics'
      }
    },
    {
      path: 'team', component:CompanyTeamComponent ,
      data: {
        breadcrumb: 'Team'
      }
    },
    {
      path: 'insights', component: CompanyInsightsComponent,
      data: {
        breadcrumb: 'Insights'
      }
    }
  ],
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }

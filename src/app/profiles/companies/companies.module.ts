import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompanyLayoutComponent } from './company-layout/company-layout.component';
import { CompanyOverviewComponent } from './company-layout/company-overview/company-overview.component';
import { CompanyTeamComponent } from './company-layout/company-team/company-team.component';
import { CompanyStatisticsComponent } from './company-layout/company-statistics/company-statistics.component';
import { CompanyAboutComponent } from './company-layout/company-about/company-about.component';
import { CompanyInsightsComponent } from './company-layout/company-insights/company-insights.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepeatModule } from '../../repeat/repeat.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ShareButtonsModule } from '@ngx-share/buttons';

@NgModule({
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule,
    NgxChartsModule,
    ShareButtonsModule
  ],
  declarations: [ CompanyOverviewComponent, CompanyTeamComponent, CompanyStatisticsComponent, CompanyAboutComponent, CompanyInsightsComponent, CompanyLayoutComponent]
})
export class CompaniesModule { }

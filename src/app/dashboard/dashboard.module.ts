import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { InsightsComponent } from './insights/insights.component';
import { InsightsTrendingComponent } from './insights/insights-trending/insights-trending.component';
import { InsightsNewComponent } from './insights/insights-new/insights-new.component';
import { InsightProvidersComponent } from './insight-providers/insight-providers.component';
import { InsightProvidersTrendingComponent } from './insight-providers/insight-providers-trending/insight-providers-trending.component';
import { InsightProvidersNewComponent } from './insight-providers/insight-providers-new/insight-providers-new.component';
import { InsightService } from '../services/insights/insight.service';
import { UtilsService } from '../services/utils.service';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { DashboardComponent } from './dashboard.component';
import { MatchHeightModule } from '../shared/directives/match-height.directive';
import { NguCarouselModule } from '../carousel/ngu-carousel.module';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ShareButtonsModule,
    MatchHeightModule,
    NguCarouselModule
  ],
  declarations: [
    InsightsComponent, 
    InsightsTrendingComponent, 
    InsightsNewComponent, 
    InsightProvidersComponent,
    InsightProvidersTrendingComponent, 
    InsightProvidersNewComponent, 
    DashboardComponent
  ],
  providers:[
    InsightService,
    UtilsService
  ]
})
export class DashboardModule { }

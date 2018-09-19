import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InsightsRoutingModule } from './insights-routing.module';
import { AllInsightsComponent } from './all-insights/all-insights.component';
import { DataTablesModule } from 'angular-datatables';
import { RepeatModule } from '../repeat/repeat.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComposeService } from '../services/compose.service';
import { UtilsService } from '../services/utils.service';
import { CommodityService } from '../services/insights/commodity.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { PreviewComponent } from './all-insights/preview/preview.component';
import { GlobalSearchComponent } from '../global-search/global-search.component';
import { MatAutocompleteModule, MatInputModule, MatSelectModule } from '@angular/material';
import { InsightsCommentsFormComponent } from './insights-comments-form/insights-comments-form.component';
import { InsightsCommentsComponent } from './insights-comments/insights-comments.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from '../services/dashboard.service';
import { TickerInsightsComponent } from '../profiles/tickers/tickers-layout/ticker-insights/ticker-insights.component';

@NgModule({
  imports: [
    CommonModule,
    InsightsRoutingModule,
    DataTablesModule,
    RepeatModule,
    ReactiveFormsModule,
    FormsModule,
    ShareButtonsModule,
    DropzoneModule,
    NgxChartsModule
  ],
  declarations: [AllInsightsComponent, PreviewComponent, InsightsCommentsFormComponent, InsightsCommentsComponent],
  providers: [ComposeService, UtilsService, DatePipe, CommodityService,DashboardService],
  exports: [PreviewComponent,InsightsCommentsFormComponent, InsightsCommentsComponent]
})
export class InsightsModule { }
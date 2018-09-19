import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TickersRoutingModule } from './tickers-routing.module';
import { TickersLayoutComponent } from './tickers-layout/tickers-layout.component';
import { TickerInsightsComponent } from './tickers-layout/ticker-insights/ticker-insights.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepeatModule } from '../../repeat/repeat.module';
import { InsightsCommentsFormComponent } from '../../insights/insights-comments-form/insights-comments-form.component';
import { InsightsCommentsComponent } from '../../insights/insights-comments/insights-comments.component';
import { InsightsModule } from '../../insights/insights.module';
import { ShareButtonsModule } from '@ngx-share/buttons';

@NgModule({
  imports: [
    CommonModule,
    TickersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule,
    InsightsModule,
    ShareButtonsModule
  ],
  declarations: [TickersLayoutComponent, TickerInsightsComponent]
})
export class TickersModule { }

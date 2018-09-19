import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TickersLayoutComponent } from './tickers-layout/tickers-layout.component';
import { TickerInsightsComponent } from './tickers-layout/ticker-insights/ticker-insights.component';

const routes: Routes = [
  {
    path: '', component: TickersLayoutComponent,
    children: [
      { path: '', component: TickerInsightsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TickersRoutingModule { }

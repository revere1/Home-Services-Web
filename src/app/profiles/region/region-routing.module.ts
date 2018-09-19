import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegionLayoutComponent } from './region-layout/region-layout.component';
import { RegionInsightsComponent } from './region-layout/region-insights/region-insights.component';
import { RegionAboutComponent } from './region-layout/region-about/region-about.component';

const routes: Routes = [
  {
    path: '', component: RegionLayoutComponent,
    children: [
      { path: '', component: RegionInsightsComponent },
      { path: 'about', component: RegionAboutComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionRoutingModule { }

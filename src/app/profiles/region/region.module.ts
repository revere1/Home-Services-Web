import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegionRoutingModule } from './region-routing.module';
import { RegionLayoutComponent } from './region-layout/region-layout.component';
import { RegionInsightsComponent } from './region-layout/region-insights/region-insights.component';
import { RegionAboutComponent } from './region-layout/region-about/region-about.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { RepeatModule } from '../../repeat/repeat.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    RegionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule,
    ShareButtonsModule
  ],
  declarations: [RegionLayoutComponent, RegionInsightsComponent, RegionAboutComponent]
})
export class RegionModule { }

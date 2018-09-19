import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectorsRoutingModule } from './sectors-routing.module';
import { SectorsLayoutComponent } from './sectors-layout/sectors-layout.component';
import { SectorsInsightsComponent } from './sectors-layout/sectors-insights/sectors-insights.component';
import { SectorsAboutComponent } from './sectors-layout/sectors-about/sectors-about.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { RepeatModule } from '../../repeat/repeat.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SectorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule,
    ShareButtonsModule
  ],
  declarations: [SectorsLayoutComponent, SectorsInsightsComponent, SectorsAboutComponent]
})
export class SectorsModule { }

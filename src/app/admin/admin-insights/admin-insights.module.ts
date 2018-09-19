import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminInsightsRoutingModule } from './admin-insights-routing.module';
import { CommoditiesFormComponent } from './commodities-form/commodities-form.component';
import { RepeatModule } from '../../repeat/repeat.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { AllInsightsComponent } from './all-insights/all-insights.component';
import { UnpublishInsightsComponent } from './unpublish-insights/unpublish-insights.component';
import { ShareButtonsModule } from '@ngx-share/buttons';

@NgModule({
  imports: [
    CommonModule,
    AdminInsightsRoutingModule,
    RepeatModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,  
    ShareButtonsModule.forRoot(),
    
   ],
  declarations: [ 
    CommoditiesFormComponent,
    AllInsightsComponent,
    UnpublishInsightsComponent,
  
  ]
})
export class AdminInsightsModule { }

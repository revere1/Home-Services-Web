import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyRoutingModule } from './currency-routing.module';
import { CurrencyLayoutComponent } from './currency-layout/currency-layout.component';
import { CurrencyInsightsComponent } from './currency-layout/currency-insights/currency-insights.component';
import { CurrencyAboutComponent } from './currency-layout/currency-about/currency-about.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { RepeatModule } from '../../repeat/repeat.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    CurrencyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule,
    ShareButtonsModule
  ],
  declarations: [CurrencyLayoutComponent, CurrencyInsightsComponent, CurrencyAboutComponent]
})
export class CurrencyModule { }

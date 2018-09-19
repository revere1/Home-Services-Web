import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProfilesRoutingModule } from './profiles-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepeatModule } from '../repeat/repeat.module';
import { HelpService } from '../services/help.service';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { ComposeService } from '../services/compose.service';
import { CommodityService } from '../services/insights/commodity.service';
import { InsightService } from '../services/insights/insight.service';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { CompanyService } from '../services/company.service';


@NgModule({
  imports: [
    CommonModule,
    ProfilesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule,
  ],
  declarations: [],
  providers: [
    HelpService,
    UserService,
    UtilsService,
    DatePipe,
    ComposeService,
    CommodityService,
    InsightService,
    CompanyService
  ]
})
export class ProfilesModule { }

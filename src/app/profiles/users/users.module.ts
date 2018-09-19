import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersLayoutComponent } from './users-layout/users-layout.component';
import { UsersOverviewComponent } from './users-layout/users-overview/users-overview.component';
import { UsersStatisticsComponent } from './users-layout/users-statistics/users-statistics.component';
import { UsersInsightsComponent } from './users-layout/users-insights/users-insights.component';
import { UsersAboutComponent } from './users-layout/users-about/users-about.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepeatModule } from '../../repeat/repeat.module';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { GlobalSearchComponent } from '../../global-search/global-search.component';
// import { MatAutocompleteModule, MatInputModule, MatSelectModule } from '@angular/material';
// import { SidebarComponent } from '../../sidebar/sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RepeatModule,
    ShareButtonsModule,
    NgxChartsModule,
  ],
  declarations: [UsersLayoutComponent, UsersOverviewComponent,UsersStatisticsComponent, UsersInsightsComponent, UsersAboutComponent]
})
export class UsersModule { }

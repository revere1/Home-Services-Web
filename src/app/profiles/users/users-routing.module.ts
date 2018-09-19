import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersLayoutComponent } from './users-layout/users-layout.component';
import { UsersOverviewComponent } from './users-layout/users-overview/users-overview.component';
import { UsersAboutComponent } from './users-layout/users-about/users-about.component';
import { UsersStatisticsComponent } from './users-layout/users-statistics/users-statistics.component';
import { UsersInsightsComponent } from './users-layout/users-insights/users-insights.component';

const routes: Routes = [
  {
    path: '', component: UsersLayoutComponent,
    children: [
      { path: '', component: UsersOverviewComponent },
      {
        path: 'about', component: UsersAboutComponent,
        data: {
          breadcrumb: 'About'
        }
      },
      {
        path: 'statistics', component: UsersStatisticsComponent,
        data: {
          breadcrumb: 'Statistics'
        }
      },
      {
        path: 'insights', component: UsersInsightsComponent,
        data: {
          breadcrumb: 'Insights'
        }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

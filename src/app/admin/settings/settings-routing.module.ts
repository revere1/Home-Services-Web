import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminNotificationsComponent } from './admin-notifications/admin-notifications.component';
import { AnalystCompaniesComponent } from './analyst-companies/analyst-companies.component';
import { CreateAnalystCompanyComponent } from './analyst-companies/create-analyst-company/create-analyst-company.component';
import { AnalystCompaniesUpdateComponent } from './analyst-companies/analyst-companies-update/analyst-companies-update.component';
import { AnalystCompaniesListComponent } from './analyst-companies/analyst-companies-list/analyst-companies-list.component';

const routes: Routes = [
  {
    path: 'change-password', component: ChangePasswordComponent,
    data: {
      breadcrumb: 'ChangePassword'
    },
  },
  {
    path: 'profile', component: ProfileComponent,
    data: {
      breadcrumb: 'Profile'
    },
  },
  {
    path: 'notifications', component: AdminNotificationsComponent,
    data: {
      breadcrumb: 'Notifications'
    },
  },
  {
    path: 'analyst-companies', component: AnalystCompaniesComponent,
    data: {
      breadcrumb: 'analyst-companies'
    },
    children: [
      { path: '', component: AnalystCompaniesListComponent },
      {
        path: 'create', component: CreateAnalystCompanyComponent,
        data: {
          breadcrumb: 'Create'
        }
      },
      {
        path: 'update/:id', component: AnalystCompaniesUpdateComponent,
        data: {
          breadcrumb: 'Update'
        }
      },
      // {
      //   path: 'view/:id', component: ViewTickerComponent,
      //   data: {
      //     breadcrumb: 'View'
      //   }
      // }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

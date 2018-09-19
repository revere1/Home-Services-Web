import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { EditComponent } from './profile/edit/edit.component';
import { AdminNotificationsComponent } from './admin-notifications/admin-notifications.component';
import { DataTablesModule } from 'angular-datatables';
import { RepeatModule } from '../../repeat/repeat.module';
import { AnalystCompaniesComponent } from './analyst-companies/analyst-companies.component';
import { AnalystCompaniesListComponent } from './analyst-companies/analyst-companies-list/analyst-companies-list.component';
import { AnalystCompaniesUpdateComponent } from './analyst-companies/analyst-companies-update/analyst-companies-update.component';
import { AnalystCompaniesFormComponent } from './analyst-companies/analyst-companies-form/analyst-companies-form.component';
import { CreateAnalystCompanyComponent } from './analyst-companies/create-analyst-company/create-analyst-company.component';


@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    RepeatModule

  ],
  declarations: [ChangePasswordComponent, ProfileComponent, EditComponent, AdminNotificationsComponent, AnalystCompaniesComponent, AnalystCompaniesListComponent, AnalystCompaniesUpdateComponent, AnalystCompaniesFormComponent, CreateAnalystCompanyComponent]
})
export class SettingsModule { }

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ClientFormService } from '../services/clients/client-form.service';
import { ScriptService } from '../services/script.service';
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';
import { CategoriesService } from '../services/categories.service';
import { SubcategoriesService } from '../services/subcategories.service';
import { StatesService } from '../services/states.service';
import { CountriesService } from '../services/countries.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { CompanyService } from '../services/company.service';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent, 
    ForgotPasswordComponent, 
    ResetPasswordComponent, 
    AuthLayoutComponent,
    LogoutComponent,
    UpdateProfileComponent,
    EditProfileComponent
  ],
  providers: [
    ScriptService,
    UtilsService,
    DatePipe,
    ClientFormService,
    UserService,
    CategoriesService,
    SubcategoriesService,
    StatesService,
    CountriesService,
    CompanyService
    // LockerFormService,
    // LockersService,
    // CommodityService,
    // ComposeService
  ]
})
export class AuthModule { }

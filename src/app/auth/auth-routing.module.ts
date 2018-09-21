import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { LogoutComponent } from './logout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { RoleGuard } from '../_guards/role.guard';
import { SidebarComponent } from '../admin/widgets/sidebar/sidebar.component';
import { SignupComponent } from './signup/signup.component';
const routes: Routes = [
  { path: '',   component: AuthLayoutComponent,
  children: [
    { path: '',   redirectTo: 'login', pathMatch: 'full' },
    { path: 'login',   component: LoginComponent },
    {path:  'signup',   component: SignupComponent},
    { path: 'logout',   component: LogoutComponent },
    { path: 'updateprofile',   component: UpdateProfileComponent,canActivate:[RoleGuard]},
    { path: 'forgot-password',   component: ForgotPasswordComponent },
    { path: 'reset-password',   component: ResetPasswordComponent }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

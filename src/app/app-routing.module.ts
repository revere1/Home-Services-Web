import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';                                                     
import { HomeComponent } from './home/home.component';
//import { AuthGuard } from './_guards/auth.guard';
import { RoleGuard } from './_guards/role.guard';
import { ProfileComponent } from './settings/profile/profile.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyWatchListComponent } from './my-watch-list/my-watch-list.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,    
    children: [
      { path: '', redirectTo: '/home',
      pathMatch: 'full' },
      { path: 'home', component: HomeComponent }
    ],
  },
  {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule'
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { role: 1, breadcrumb: 'Home' },
    loadChildren: 'app/admin/admin.module#AdminModule'
  },
  // {
  //   path: 'client',
  //   canActivate: [RoleGuard],
  //   data: { role: 2, breadcrumb: 'Home' },
  //   loadChildren: 'app/client/client.module#ClientModule'
  // },
  // {
  //   path: 'analyst',
  //   canActivate: [RoleGuard],
  //   data: { role: 3, breadcrumb: 'Home' },
  //   loadChildren: 'app/analyst/analyst.module#AnalystModule'
  // },
  
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'insights',
         data: { breadcrumb: 'insights' },
        loadChildren: 'app/insights/insights.module#InsightsModule',
      },
      {
        path: '',
        loadChildren: 'app/profiles/profiles.module#ProfilesModule',
      },
      { path: "watch-list", 
      data: { breadcrumb: 'watch-list' },
      component: MyWatchListComponent },

    ]
  },
  { path: "contact-us", component: ContactUsComponent },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

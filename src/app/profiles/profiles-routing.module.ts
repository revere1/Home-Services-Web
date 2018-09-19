import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

const routes: Routes = [     
  {
    path: 'company/:company',
    loadChildren: 'app/profiles/companies/companies.module#CompaniesModule'
  },
  {
    path: 'ticker/:id',
    loadChildren: 'app/profiles/tickers/tickers.module#TickersModule'
  },
  {
    path: 'profile/:id',
    loadChildren: 'app/profiles/users/users.module#UsersModule'
  },  
  {
    path: 'sector/:id',
    loadChildren: 'app/profiles/sectors/sectors.module#SectorsModule'
  },
  {
    path: 'currency/:id',
    loadChildren: 'app/profiles/currency/currency.module#CurrencyModule'
  },
  {
    path: 'region/:id',
    loadChildren: 'app/profiles/region/region.module#RegionModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }

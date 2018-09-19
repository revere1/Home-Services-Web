import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsightsComponent } from './insights/insights.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
  path:'',
  children: [
{path: '', component:DashboardComponent}
  ]
 
}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SectorsLayoutComponent } from './sectors-layout/sectors-layout.component';
import { SectorsInsightsComponent } from './sectors-layout/sectors-insights/sectors-insights.component';
import { SectorsAboutComponent } from './sectors-layout/sectors-about/sectors-about.component';

const routes: Routes = [
    {
    path: '', component:SectorsLayoutComponent ,
    children: [
      { path: '', component:SectorsInsightsComponent  },
      { path: 'about', component:SectorsAboutComponent  }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectorsRoutingModule { }

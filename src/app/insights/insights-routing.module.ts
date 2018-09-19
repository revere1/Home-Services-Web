import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllInsightsComponent } from './all-insights/all-insights.component';
import { PreviewComponent } from './all-insights/preview/preview.component';


const routes: Routes = [
  {
    path: '',
    component: AllInsightsComponent,
  },
  {
    path: 'preview/:id', component: PreviewComponent,
    data: {
      breadcrumb: 'preview'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsightsRoutingModule { }
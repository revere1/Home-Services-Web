import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommoditiesFormComponent } from './commodities-form/commodities-form.component';
import { AllInsightsComponent } from './all-insights/all-insights.component';
import { UnpublishInsightsComponent } from './unpublish-insights/unpublish-insights.component';

const routes: Routes = [
  {
    path: '', component: AllInsightsComponent,
    data: {
      breadcrumb: 'All Insights'
    },
  },
  {
    path: 'my-insights', component: UnpublishInsightsComponent,
    data: {
      breadcrumb: 'Unpublish-Insights'
    },
  },
  {
    path: 'commodities', component: CommoditiesFormComponent,
    data: {
      breadcrumb: 'Note Types'
    },
  },
  { path: 'compose', loadChildren: 'app/admin/admin-insights/admin-compose/admin-compose.module#AdminComposeModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInsightsRoutingModule { }

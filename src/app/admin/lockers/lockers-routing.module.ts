import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LockerFormComponent } from './locker-form/locker-form.component';
// import { LockersListComponent } from './lockers-list/lockers-list.component';

const LockerRoutes: Routes = [
 
 // { path: 'create', component: CreateHelpFormComponent },
 { path: '', data: {breadcrumb: 'lockers'},
  component: LockerFormComponent },
 
//  {path: 'create', component: LockersListComponent,
//            data: {
//              breadcrumb: 'Create'
//            }
//  },


 ];

@NgModule({
  imports: [RouterModule.forChild(LockerRoutes)],
  exports: [RouterModule]
})
export class LockersRoutingModule { }

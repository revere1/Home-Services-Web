
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { LockerFormService } from './../../../services/lockers/locker-form.service';
import { LockersRoutingModule } from './lockers-routing.module';
import { LockerFormComponent } from './locker-form/locker-form.component';
import { RepeatModule } from '../../repeat/repeat.module';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { MatchHeightModule } from '../../shared/directives/match-height.directive';

// import { LockersListComponent } from './lockers-list/lockers-list.component';
//import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@NgModule({
  imports: [
    CommonModule,
    RepeatModule,
    MatchHeightModule,
    FormsModule,
    ReactiveFormsModule,
    LockersRoutingModule,
    DropzoneModule,
    //InfiniteScrollModule
  ],
  declarations: [LockerFormComponent]
})
export class LockersModule { }

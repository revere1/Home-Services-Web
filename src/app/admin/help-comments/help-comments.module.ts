import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpCommentsRoutingModule } from './help-comments-routing.module';
import { HelpCommentsFormComponent } from './help-comments-form/help-comments-form.component';
import { DataTablesModule } from 'angular-datatables';
import { HelpCommentsListComponent } from './help-comments-list/help-comments-list.component';
import { HelpCommentViewComponent } from './help-comment-view/help-comment-view.component';
import { RepeatModule } from '../../repeat/repeat.module';


@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    RepeatModule,
    ReactiveFormsModule,
    FormsModule,
    HelpCommentsRoutingModule,
  ],
  declarations: [
    HelpCommentsFormComponent,
    HelpCommentsListComponent, 
    HelpCommentViewComponent    
  ]
})
export class HelpCommentsModule { }

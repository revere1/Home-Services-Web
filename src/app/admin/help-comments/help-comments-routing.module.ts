import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpCommentsFormComponent } from './help-comments-form/help-comments-form.component';
import { HelpCommentsListComponent } from './help-comments-list/help-comments-list.component';
import { HelpCommentViewComponent } from './help-comment-view/help-comment-view.component';

const routes: Routes = [
  { path: '', component: HelpCommentsListComponent },
  {
    path: 'reply', component: HelpCommentsFormComponent,
    data: {
      breadcrumb: 'Reply'
    }
  },
  {
    path: 'read/:id', component: HelpCommentViewComponent,
    data: {
      breadcrumb: 'Read'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpCommentsRoutingModule { }

import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService,IBreadcrumb} from 'ng2-breadcrumbs';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-create-states',
  templateUrl: './create-states.component.html',
  styleUrls: ['./create-states.component.css']
})
export class CreateStatesComponent implements OnInit {

  constructor(
    private _utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService
  ) { }

  ngOnInit() {

           /*BreadCrumb*/
           let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'States' , url: 'states', params: []},
           {label: 'Create' , url: 'create', params: []}];
         this._utils.changeBreadCrumb(bcList);
         this._utils.currentBSource.subscribe(list => {
           this.breadcrumbsService.store(list);
         });
         /*End - BreadCrumb*/
  }

}

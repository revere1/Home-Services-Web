import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbsService,IBreadcrumb} from 'ng2-breadcrumbs';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateSectorComponent implements OnInit {
  pageTitle = 'Create Event';
  constructor( private breadcrumbsService:BreadcrumbsService,
    private _utils: UtilsService,
  ) { }

  ngOnInit() {
   

          /*BreadCrumb*/
          let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Categories' , url: 'categories', params: []},
          {label: 'Create' , url: 'create', params: []}];
        this._utils.changeBreadCrumb(bcList);
        this._utils.currentBSource.subscribe(list => {
          this.breadcrumbsService.store(list);
        });
        /*End - BreadCrumb*/
  }

}

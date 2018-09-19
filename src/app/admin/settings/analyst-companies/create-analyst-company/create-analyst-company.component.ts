import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-create-analyst-company',
  templateUrl: './create-analyst-company.component.html',
  styleUrls: ['./create-analyst-company.component.css']
})
export class CreateAnalystCompanyComponent implements OnInit {

  pageTitle = 'Create Event';

  constructor(private title: Title,
    private _utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
     /*BreadCrumb*/
     let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Analyst Companies' , url: 'settings/analyst-companies', params: []},
     {label: 'Create' , url: 'create', params: []}];
   this._utils.changeBreadCrumb(bcList);
   this._utils.currentBSource.subscribe(list => {
     this.breadcrumbsService.store(list);
   });
   /*End - BreadCrumb*/
  }

}

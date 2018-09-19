import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-createcountries',
  templateUrl: './createcountries.component.html',
  styleUrls: ['./createcountries.component.css']
})
export class CreatecountriesComponent implements OnInit {

  pageTitle = 'Create Event';
  constructor(
    private _utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService
  ) { }

  ngOnInit() {

       /*BreadCrumb*/
       let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Countries' , url: 'countries', params: []},
       {label: 'Create' , url: 'create', params: []}];
     this._utils.changeBreadCrumb(bcList);
     this._utils.currentBSource.subscribe(list => {
       this.breadcrumbsService.store(list);
     });
     /*End - BreadCrumb*/
  }

}

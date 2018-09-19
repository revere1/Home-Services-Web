import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Subscription } from 'rxjs/Subscription';
import { CountriesModel } from '../../../models/countries.model';
import { CountriesService } from '../../../services/countries.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
@Component({
  selector: 'app-updatecountries',
  templateUrl: './updatecountries.component.html',
  styleUrls: ['./updatecountries.component.css']
})
export class UpdatecountriesComponent implements OnInit {
countries : CountriesModel;
private id: number;
routeSub: Subscription;
loading: boolean;
countriesSub: Subscription;
error: boolean;


  constructor(  private route: ActivatedRoute,  
               private _countriesapi: CountriesService,
               private breadcrumbsService:BreadcrumbsService,
                public utils: UtilsService) { }

  ngOnInit() {
    
          /*BreadCrumb*/
          let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Countries' , url: 'countries', params: []},
          {label: 'Update' , url: 'update', params: []}];
        this.utils.changeBreadCrumb(bcList);
        this.utils.currentBSource.subscribe(list => {
          this.breadcrumbsService.store(list);
        });
        /*End - BreadCrumb*/
    this.routeSub = this.route.params
    .subscribe(params => {
      this.id = params['id'];
      this._getCountries();
    });
  }

  private _getCountries() {
    this.loading = true;
    // GET event by ID
    this.countriesSub = this._countriesapi
      .getCountryById$(this.id)
      .subscribe(
        res => {
          if(res.success){
            this.countries= res.data;         
          }          
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.error = true;
        }
      );
  }
  
  ngOnDestroy() {
    this.routeSub.unsubscribe();
    //this.tabSub.unsubscribe();
    this.countriesSub.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from '../../../env.config';
import { CountriesService } from '../../../services/countries.service';
import { UtilsService } from '../../../services/utils.service';
import { CountriesModel } from '../../../models/countries.model';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv';
import { BreadcrumbsService,IBreadcrumb} from 'ng2-breadcrumbs';
class Countries {
  id: number;
  name: string;
  status: string;
  createdBy : number  
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.css']
})
export class CountriesListComponent implements OnInit,OnDestroy{

  private allItems: {};
  dtOptions: DataTables.Settings = {};
  error:boolean;
  private apiEvents=[];
  public bcList :IBreadcrumb[];
  countries: Countries[];
  constructor(private http: HttpClient, 
    private _countriesService: CountriesService, 
    private _utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService,
    private meta: Meta,
    public toastr: ToastsManager,
  private route : Router) {
      this.meta.addTag({ name: 'description', content: 'All the list of countries' });
      this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
      this.meta.addTag({ name: 'keywords', content: 'countries, revere, equity' });
     }

  ngOnInit() {

    this.bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Countries' , url: 'countries', params: []}];
    this._utils.changeBreadCrumb(this.bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        var myEfficientFn = this._utils.debounce(()=>{           
          let apiEvent = this._countriesService.filterCountries$(dataTablesParameters,'filterCountries')
            .subscribe(resp => {
              that.countries = resp.data;
               
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });   
            
            (this.apiEvents).push(apiEvent);
        },1000,false);

        myEfficientFn();
        
        
      },
      columns: [
            { data: 'name' },
            { data: 'status' },
            // { data: 'createdBy' },
            // { data: 'updatedBy' },
            { data: 'id' }
          ]
    };
  
  }

  // download() {
  //   this._countriesService.getCountries$()
  //   .subscribe(data => {
  //   //API data
  //   this.allItems = this.countries;
 

  //   var options = { 
   
  //     headers: ['ID','Name','Status','CreatedBy','UpdatedBy','CreatedAt','UpdatedAt'] 
  //      };


  //   new Angular2Csv(this.allItems, 'CountriesList',options);
  
  //   }); 
  // }
  deleteCountry(id:number){
    var delmsg = confirm("Are u Sure Want to delete?");
    if(delmsg){
      let apiEvent = this._countriesService.deleteCountryById$(id)
    .subscribe(
      data => this._handleSubmitSuccess(data,id),
      err => this._handleSubmitError(err)
    );
    (this.apiEvents).push(apiEvent);
  }
}
  private _handleSubmitSuccess(res,id=0) {
    this.error = false;
  
    // Redirect to event detail
    if(res.success){

      this.toastr.success(res.message,'Success'); 

      let pos = this.countries.map(function(e) { return e.id; }).indexOf(id);
      this.countries.splice(pos, 1);
    }
    else{       
      this.toastr.error(res.message,'Invalid');  
    }
   
  }


  private _handleSubmitError(err) {

    this.toastr.error(err.message,'Error');
  
    this.error = true;
  }
  public ngOnDestroy(){
    if((this.apiEvents).length){
      this.apiEvents.forEach(val=>{
        val.unsubscribe();
      })
    }
  }
}

import { Component, OnInit,OnDestroy} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from '../../../env.config';
import { StatesService } from '../../../services/states.service';
import { UtilsService } from '../../../services/utils.service';
import { StatesModel } from '../../../models/states.model';
import { ToastsManager } from 'ng2-toastr';
import { Angular2Csv } from 'angular2-csv';
import { BreadcrumbsService,IBreadcrumb} from 'ng2-breadcrumbs';
import {Router} from '@angular/router'
class States {
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
  selector: 'app-states-list',
  templateUrl: './states-list.component.html',
  styleUrls: ['./states-list.component.css']
})
export class StatesListComponent implements OnInit {
  private allItems: {};
  dtOptions: DataTables.Settings = {};
  error:boolean;
  apiEvents=[];
  public bcList :IBreadcrumb[];
  states: States[];
  constructor(private http: HttpClient, 
    private _statesService:StatesService, 
    private _utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService,
    private meta: Meta,
    public toastr: ToastsManager,
  public route : Router) { 
      this.meta.addTag({ name: 'description', content: 'All the list of States' });
      this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
      this.meta.addTag({ name: 'keywords', content: 'states, revere, equity' });
    }

  ngOnInit() {

    this.bcList = [{label: 'Home' , url: 'home', params: []},{label: 'States' , url: 'states', params: []}];
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
          let apiEvent=  this._statesService.filterStates$(dataTablesParameters,'filterStates')
            .subscribe(resp => {
              that.states = resp.data;  
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




  download() {
    this._statesService.getStates$()
    .subscribe(data => {
    //API data
    this.allItems =this.states;

  
     
    var options = { 
    // fieldSeparator: ',',
    // quoteStrings: '"',
    // decimalseparator: '.',
    // showLabels: true, 
    // showTitle: true,
    headers: ['ID','Name','Status','CreatedBy','UpdatedBy','CreatedAt','UpdatedAt'] 
     };
    new Angular2Csv(this.allItems, 'StatesList',options);
    //new Angular2Csv(dummyData, 'My Report',options);
    }); 
  }
  deleteState(id:number){
    var delmsg = confirm("Are u Sure Want to delete?");
    if(delmsg){
      let apiEvent=this._statesService.deleteStateById$(id)
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
      let pos = this.states.map(function(e) { return e.id; }).indexOf(id);
      this.states.splice(pos, 1);
    }
    else{       
      this.toastr.error(res.message,'Invalid');  
    }
   
  }


  private _handleSubmitError(err) {

    this.toastr.error(err.message,'Error');
  
    this.error = true;
  }
  public ngonDestory (){
    if((this.apiEvents).length){
      this.apiEvents.forEach(val=>{
        val.unsubscribe();
      })

    }
    
  }
}

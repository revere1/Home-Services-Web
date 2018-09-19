import { Component, OnInit ,OnDestroy} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from '../../../env.config';
import { SubcategoriesService } from '../../../services/subcategories.service';
import { UtilsService } from '../../../services/utils.service';
import { SubCategoryModel } from '../../../models/sub-category.model';
import { ToastsManager } from 'ng2-toastr';
import {Router} from '@angular/router';
import { Angular2Csv } from 'angular2-csv';
class SubCategory {
  subcategory_name: string;
  status: string;
  createdBy : number
  id:number
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-sub-category-list',
  templateUrl: './sub-category-list.component.html',
  styleUrls: ['./sub-category-list.component.css']
})
export class SubCategoryListComponent implements OnInit {

  private allItems: {};
  public serverURL = ENV.SERVER_URL;
  dtOptions: DataTables.Settings = {};
  error:boolean;
  apiEvents=[];
  subcategories: SubCategory[];
  constructor(private http: HttpClient, 
    private _subCategoriesService:SubcategoriesService, 
    private _utils: UtilsService,
    private meta: Meta,
    public toastr: ToastsManager,
    public route : Router
  ) { 
      this.meta.addTag({ name: 'description', content: 'All the list of Subcategories' });
      this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
      this.meta.addTag({ name: 'keywords', content: 'Subcategories, revere, equity' });
    }

  ngOnInit() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        var myEfficientFn = this._utils.debounce(()=>{           
          let apiEvent =  this._subCategoriesService.filterSubCategory$(dataTablesParameters,'filterSubCategory')
            .subscribe(resp => {
              that.subcategories = resp.data;  
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
            { data: 'category_id' },
            { data: 'subcategory_name' },
            { data: 'status' },
            { data: 'path' },
            { data: 'createdAt' },
            { data: 'id' }
          ]
    };
  
  }

  download() {
    this._subCategoriesService.getsubCategory$()
    .subscribe(data => {
    //API data
    this.allItems = this.subcategories;
 
    var options = { 
      // fieldSeparator: ',',
      // quoteStrings: '"',
      // decimalseparator: '.',
      // showLabels: true, 
      // showTitle: true,
      headers: ['ID','Subcategory Name','Category Name','Status','CreatedAt'] 
       };

    new Angular2Csv(this.allItems, 'Sub-SectorList',options);
    //new Angular2Csv(dummyData, 'My Report',options);
    }); 
  }
  deleteSubSector(id:number){
    var delmsg = confirm("Are u Sure Want to delete?");
    if(delmsg){
   let apiEvent= this._subCategoriesService.deleteSubCategoryById$(id)
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
      let pos = this.subcategories.map(function(e) { return e.id; }).indexOf(id);
      this.subcategories.splice(pos, 1);
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

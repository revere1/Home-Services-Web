import { Component, OnInit,OnDestroy} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from '../../../env.config';
import { CategoriesService } from '../../../services/categories.service';
import { UtilsService } from '../../../services/utils.service';
import { CategoriesModel } from '../../../models/categories.model';
import { ToastsManager } from 'ng2-toastr';
import { Angular2Csv } from 'angular2-csv';
import { BreadcrumbsService,IBreadcrumb} from 'ng2-breadcrumbs';
class Category {
  category_name: string;
  company: string;
  industry: string;
  sector: string;
  id: number;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class SectorsListComponent implements OnInit {
  //surl:string = ENV.BASE_API;
  public serverURL = ENV.SERVER_URL;
  private allItems: {};
  dtOptions: DataTables.Settings = {};
  error:boolean;
  apiEvents=[];
  public bcList :IBreadcrumb[];
  categories: Category[];
  
  constructor(private http: HttpClient, 
    private _categoriesService: CategoriesService, 
    private _utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService,
    private meta: Meta,
    public toastr: ToastsManager) {
      this.meta.addTag({ name: 'description', content: 'All the list of categories' });
      this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
      this.meta.addTag({ name: 'keywords', content: 'categories, epooja, equity' });
     }

  ngOnInit() {

    this.bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Categories' , url: 'categories', params: []}];
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
           let apiEvent= this._categoriesService.filterCategories$(dataTablesParameters,'filterCategories')
            .subscribe(resp => {
              that.categories = resp.data;  
              console.log(that.categories)
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
            { data: 'category_name' },
            { data: 'category_desc' },
            { data: 'path' },
            { data: 'status' },
            { data: 'createdAt' },
            { data: 'id' }
          ]
    };
  }
    download() {
      this._categoriesService.getCategory$()
      .subscribe(data => {
      //API data
      this.allItems =this.categories;
    
       
      var options = { 
      // fieldSeparator: ',',
      // quoteStrings: '"',
      // decimalseparator: '.',
      // showLabels: true, 
      // showTitle: true,
      headers: ['ID','Category Name','Status','Category_Desc','CreatedAt'] 
       };
      new Angular2Csv(this.allItems, 'SectorList',options);
      //new Angular2Csv(dummyData, 'My Report',options);
      }); 
    }
  
  deleteCategory(id:number){
    var delmsg = confirm("Are u Sure Want to delete?");
    if(delmsg){
  
    let apiEvent=this._categoriesService.deleteCategoryById$(id)
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
      let pos = this.categories.map(function(e) { return e.id; }).indexOf(id);
      this.categories.splice(pos, 1);
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

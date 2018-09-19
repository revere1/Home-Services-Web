import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from '../../../env.config';
import { ProductService } from '../../../services/product.service';
//import { setTimeout } from 'timers';
import { UtilsService } from '../../../services/utils.service';
import { ToastsManager } from 'ng2-toastr';
import { Angular2Csv } from 'angular2-csv';
import { BreadcrumbsService,IBreadcrumb} from 'ng2-breadcrumbs';


class Product {
  product_name: string;
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
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  public serverURL = ENV.SERVER_URL;
  private allItems: {};
  products: Product[];
  error: boolean;
  apiEvents = [];
  submit : boolean = false;
  public bcList :IBreadcrumb[];
  constructor(private http: HttpClient,
    private router: Router,
    private _productApi: ProductService,
    private _utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService,
    private meta: Meta,
    public toastr: ToastsManager) {
    this.meta.addTag({ name: 'description', content: 'All the list of products' });
    this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
    this.meta.addTag({ name: 'keywords', content: 'products, revere, equity' });
  }
  ngOnInit(): void {
    this.bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Products' , url: 'products', params: []}];
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
        var myEfficientFn = this._utils.debounce(() => {
          let apiEvent = this._productApi.filterProducts$(dataTablesParameters, 'filterProducts')
            .subscribe(resp => {
              that.products = resp.data;
              that.submit = true;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });
          (this.apiEvents).push(apiEvent);
        }, 1000, true);
        myEfficientFn();
      },

      columns: [
        { data: 'product_img' },
        { data: 'product_name' },
        { data: 'product_code' },
        { data: 'category_id' },
        { data: 'subcategory_id' },
        { data: 'cost' },
        { data: 'delivery_days' },
        { data: 'quantity' },
        { data: 'status' },
        { data: 'id' }
      ]
    };
  }
  download() {
    this._productApi.getproducts$()
      .subscribe(data => {
        //API data
        this.allItems = this.products;
        console.log(this.allItems)
        var options = {
          headers: [
            'ID', 
            'Product_name',
            'Product_description', 
            'Cost', 
            'Quantity', 
            'Category_name',
            'Subcategory_name',
            'CreatedAt'
          ]};
        new Angular2Csv(this.allItems, 'ProductsList', options);
      });
  }
  deleteProduct(id: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {
      let apiEvent = this._productApi.deleteProductById$(id)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }
  private _handleSubmitSuccess(res, id = 0) {
    this.error = false;
    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      let pos = this.products.map(function (e) { return e.id; }).indexOf(id);
      this.products.splice(pos, 1);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    this.error = true;
  }
  public ngonDestory() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      });
    }
  }
}

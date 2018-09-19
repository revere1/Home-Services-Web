import { Component, OnInit,OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../../services/product.service';
import { UtilsService } from '../../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ProductModel } from '../../../models/product.model';
import { BreadcrumbsService } from 'ng2-breadcrumbs';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

  pageTitle = 'Update Event';
  routeSub: Subscription;
  private id: number;
  loading: boolean;
  productSub: Subscription;
  product: ProductModel;
  error: boolean;

  constructor(
    private route: ActivatedRoute,    
    private title: Title,
    private _productapi: ProductService,
    private breadcrumbsService:BreadcrumbsService,
    public utils: UtilsService
  ) { }

  ngOnInit() {

          /*BreadCrumb*/
          let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Products' , url: 'products', params: []},
          {label: 'Update' , url: 'update', params: []}];
        this.utils.changeBreadCrumb(bcList);
        this.utils.currentBSource.subscribe(list => {
          this.breadcrumbsService.store(list);
        });
        /*End - BreadCrumb*/
  

    this.title.setTitle(this.pageTitle);
    // Set event ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getProduct();
      });
  }


  private _getProduct() {
    this.loading = true;
    // GET event by ID
    this.productSub = this._productapi
      .getUserById$(this.id)
      .subscribe(
        res => {
          if(res.success){
            this.product = res.data; 
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
    this.productSub.unsubscribe();
  }

}

import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Subscription } from 'rxjs/Subscription';
import {CategoriesModel } from '../../../models/categories.model';
import { CategoriesService } from '../../../services/categories.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbsService } from 'ng2-breadcrumbs';


@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {

  categories : CategoriesModel;
  private id: number;
  routeSub: Subscription;
  loading: boolean;
  categoriesSub: Subscription;
  error: boolean;
  
  
    constructor(  private route: ActivatedRoute,  
                 private _categorysapi: CategoriesService,
                 private breadcrumbsService:BreadcrumbsService,
                  public utils: UtilsService) { }
  
    ngOnInit() {

                /*BreadCrumb*/
                let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Categories' , url: 'categories', params: []},
                {label: 'Update' , url: 'update', params: []}];
              this.utils.changeBreadCrumb(bcList);
              this.utils.currentBSource.subscribe(list => {
                this.breadcrumbsService.store(list);
              });
              /*End - BreadCrumb*/
      this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getCategories();
      });
    }
  
    private _getCategories() {
      this.loading = true;
      // GET event by ID
      this.categoriesSub = this._categorysapi
        .getSectorById$(this.id)
        .subscribe(
          res => {
            if(res.success){
              this.categories= res.data;         
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
      this.categoriesSub.unsubscribe();
    }
  }


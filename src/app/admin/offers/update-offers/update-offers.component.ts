import { Component, OnInit,OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { OfferModel } from '../../../models/offer.model';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { OffersService } from '../../../services/offers.service ';

@Component({
  selector: 'app-update-offers',
  templateUrl: './update-offers.component.html',
  styleUrls: ['./update-offers.component.css']
})
export class UpdateOffersComponent implements OnInit {

  pageTitle = 'Update Event';
  routeSub: Subscription;
  private id: number;
  loading: boolean;
  offerSub: Subscription;
  offer: OfferModel;
  error: boolean;

  constructor(
    private route: ActivatedRoute,    
    private title: Title,
    private _offerapi: OffersService,
    private breadcrumbsService:BreadcrumbsService,
    public utils: UtilsService
  ) { }

  ngOnInit() {

          /*BreadCrumb*/
          let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Offers' , url: 'offers', params: []},
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
    this.offerSub = this._offerapi
      .getUserById$(this.id)
      .subscribe(
        res => {
          if(res.success){
            this.offer = res.data; 
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
    this.offerSub.unsubscribe();
  }

}


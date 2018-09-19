import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from '../../../env.config';
import { OffersService } from '../../../services/offers.service ';
import { UtilsService } from '../../../services/utils.service';
import { ToastsManager } from 'ng2-toastr';
import { Angular2Csv } from 'angular2-csv';
import { BreadcrumbsService,IBreadcrumb} from 'ng2-breadcrumbs';


class Offer {
  offer_name: string;
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
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.css']
})
export class OffersListComponent implements OnInit {


  dtOptions: DataTables.Settings = {};
  public serverURL = ENV.SERVER_URL;
  private allItems: {};
  offers: Offer[];
  error: boolean;
  apiEvents = [];
  submit : boolean = false;
  public bcList :IBreadcrumb[];
  constructor(private http: HttpClient,
    private router: Router,
    private _offerApi: OffersService,
    private _utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService,
    private meta: Meta,
    public toastr: ToastsManager) {
    this.meta.addTag({ name: 'description', content: 'All the list of products' });
    this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
    this.meta.addTag({ name: 'keywords', content: 'products, revere, equity' });
  }
  ngOnInit(): void {
    this.bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Offers' , url: 'offers', params: []}];
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
          let apiEvent = this._offerApi.filterOffers$(dataTablesParameters, 'filterOffers')
            .subscribe(resp => {
              that.offers = resp.data;
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
        { data: 'offer_img' },
        { data: 'offer_name' },
        { data: 'offer_code' },
        { data: 'discount_type' },
        { data: 'discount_value' },
        { data: 'limit' },
        { data: 'limit_value' },
        { data: 'status' },
        { data: 'id' }
      ]
    };
  }
  download() {
    this._offerApi.getOffers$()
      .subscribe(data => {
        //API data
        this.allItems = this.offers;
        console.log(this.allItems)
        var options = {
          headers: [
            'ID', 
            'Offer_name',
            'Offer_description', 
            'Discount_Type', 
            'Discount_Value', 
            'Limit',
            'Limit_Value',
            'CreatedAt'
          ]};
        new Angular2Csv(this.allItems, 'OffersList', options);
      });
  }
  deleteProduct(id: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {
      let apiEvent = this._offerApi.deleteOfferById$(id)
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
      let pos = this.offers.map(function (e) { return e.id; }).indexOf(id);
      this.offers.splice(pos, 1);
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

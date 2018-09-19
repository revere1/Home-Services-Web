import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, NgForm } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { UtilsService } from '../../services/utils.service';
import { MacroTypeService } from '../../services/macrotype.service';
import { BreadcrumbsService,IBreadcrumb} from 'ng2-breadcrumbs';

export class CurrencyModel {
  constructor(
    public name: string,
    public id?: number) {
  }
}
export class CurrencyFormModel {
  constructor(public name: string) {

  }
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  @Input() event: CurrencyModel;
  createform: boolean = false;
  formEvent: CurrencyFormModel;
  submitEventObj: CurrencyModel;
  currencyForm: FormGroup;
  submitEventSub: any;
  private allItems: {};
  dtOptions: DataTables.Settings = {};
  error: boolean;
  private apiEvents = [];
  currency: any[];
  popupid: number;
  currencypopup = [];
  public bcList :IBreadcrumb[];
  showModel: boolean = false;
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;


  constructor(private fb: FormBuilder,
    private _macroApi: MacroTypeService,
    public toastr: ToastsManager,
    private route: Router,
    private breadcrumbsService:BreadcrumbsService,
    private _utils: UtilsService,
    private http: HttpClient) {

    this.currencyForm = new FormGroup({
      name: new FormControl(),
    });
  }
  ngOnInit() {
    this.bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Currency' , url: 'currency', params: []}];
    this._utils.changeBreadCrumb(this.bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    this.getCurrency()
    this.createform = false;
    this.currencyForm = this.fb.group({
      name: ['', Validators.required],
    });
    // this.formEvent = this._setFormEvent(); 
  }

  private _setFormEvent() {
    return new CurrencyModel(
      this.event.name
    );
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  public getCurrency() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        var myEfficientFn = this._utils.debounce(() => {
          let apiEvent = this._macroApi.filterRegorCurrency$(dataTablesParameters, 'filterCurrency','currency')
            .subscribe(resp => {
              that.currency = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });

          (this.apiEvents).push(apiEvent);
        }, 1000, false);

        myEfficientFn();
      },
      columns: [
        { data: 'name' },
        { data: 'id' }
      ]
    };
  }

  private _getSubmitObj() {
    return new CurrencyModel(
      this.currencyForm.get('name').value
    );
  }

  create() {
    this.createform = true;
  }

  download() {
    this._macroApi.getRegorCurrency('currency')
      .subscribe(data => {
        this.allItems = this.currency;
        var options = {
          headers: ['ID', 'Name']
        };
        new Angular2Csv(this.allItems, 'CurrencyList', options);
      });
  }

  deleteCurrency(id: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {
      let apiEvent = this._macroApi.deleteRegorCurrencyById$(id,'currency')
        .subscribe(
          data => {
            this.rerender();
            this._handleSubmitSuccess1(data, id);
          },
          err => this._handleSubmitError(err)
        );
      (this.apiEvents).push(apiEvent);
    }
  }

  private _handleSubmitSuccess1(res, id = 0) {
    this.error = false;
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      let pos = this.currency.map(function (e) { return e.id; }).indexOf(id);
      this.currency.splice(pos, 1);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }

  modelopen(id) {
    this.popupid = id;
    this.currencypopup = [];
    this.getCurrencyById();
    this.showModel = true;
  }

  private getCurrencyById(append = true) {
    this._macroApi
      .getRegorCurrencyById$(this.popupid,'currency')
      .subscribe(
        res => {
          if (res.success) {
            this.currencypopup = res.data;
          }
        },
        err => {
          this.error = true;
        }
      );
  }

  saveCurrency() {
    this.submitEventObj = this._getSubmitObj();
    this._macroApi
      .postEvent$(this.submitEventObj,'currency')
      .subscribe(
        data => {
          this._handleSubmitSuccess(data);
          this.rerender();
          if (data.success) {
            (this.currency).push(data.data);
          }
        },
        err => this._handleSubmitError(err)
      );
  }

  updateCurrency(id) {
    this.submitEventObj = this._getSubmitObj();
    this._macroApi
      .editEvent$(id, this.submitEventObj,'currency')
      .subscribe(
        data => {
          this.rerender();
          this._handleSubmitSuccess(data);
        },
        err => this._handleSubmitError(err)
      );
  }
  private _handleSubmitSuccess(res) {
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      let that = this;
      $(function () {
        $('button.close').trigger('click');
        that.showModel = false;
        that.createform = false;
      });
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
  }
}

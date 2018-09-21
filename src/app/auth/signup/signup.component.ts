import { Component, OnInit,ViewEncapsulation, OnDestroy, Input, ViewChild, AfterViewInit } from '@angular/core';
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
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';


export class RegionsModel {
  constructor(
    public name: string,
    public id?: number) {
  }
}
export class RegionsFormModel {
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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit,AfterViewInit {
  @Input() event: RegionsModel;
  createform: boolean = false;
  formEvent: RegionsFormModel;
  submitEventObj: RegionsModel;
  regionsForm: FormGroup;
  submitEventSub: any;
  private allItems: {};
  public dtOptions: DataTables.Settings = {};
  public error: boolean;
  private apiEvents = [];
  public regions: any[];
  public popupid: number;
  public regionspopup = [];
  public bcList: IBreadcrumb[];
  showModel: boolean = false;
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(private fb: FormBuilder,
    private _macroApi: MacroTypeService,
    public toastr: ToastsManager,
    private route: Router,
    private breadcrumbsService: BreadcrumbsService,
    private _utils: UtilsService,
    private http: HttpClient) {
    this.regionsForm = new FormGroup({
      name: new FormControl(),
    });
  }

  ngOnInit() {
    this.bcList = [
    { label: 'Home', url: 'home', params: [] }, 
    { label: 'Regions', url: 'regions', params: [] }
  ];
    this._utils.changeBreadCrumb(this.bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    this.getRegions()
    this.createform = false;
    this.regionsForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  private _setFormEvent() {
    return new RegionsFormModel(
      this.event.name
    );
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  public rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  public getRegions() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        var myEfficientFn = this._utils.debounce(() => {
          let apiEvent = this._macroApi.filterRegorCurrency$(dataTablesParameters, 'filterRegions', 'region')
            .subscribe(resp => {
              that.regions = resp.data;
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
    return new RegionsModel(
      this.regionsForm.get('name').value
    );
  }

  create() {
    this.createform = true;
  }

  public download() {
    this._macroApi.getRegorCurrency('region')
      .subscribe(data => {
        this.allItems = this.regions;
        var options = {
          headers: ['ID', 'Name']
        };
        new Angular2Csv(this.allItems, 'RegionsList', options);
      });
  }

  public deleteRegion(id: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {
      let apiEvent = this._macroApi.deleteRegorCurrencyById$(id, 'region')
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
      let pos = this.regions.map(function (e) { return e.id; }).indexOf(id);
      this.regions.splice(pos, 1);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }
  }

  modelopen(id) {
    this.popupid = id;
    this.regionspopup = [];
    this.getRegionById();
    this.showModel = true;
  }

  private getRegionById(append = true) {
    this._macroApi
      .getRegorCurrencyById$(this.popupid, 'region')
      .subscribe(
        res => {
          if (res.success) {
            this.regionspopup = res.data;
          }
        },
        err => {
          this.error = true;
        }
      );
  }

  saveRegion() {
    this.submitEventObj = this._getSubmitObj();
    this._macroApi
      .postEvent$(this.submitEventObj, 'region')
      .subscribe(
        data => {
          this._handleSubmitSuccess(data);
          this.rerender();
          if (data.success) {
            (this.regions).push(data.data);
          }
        },
        err => this._handleSubmitError(err)
      );
  }

  updateRegion(id) {
    this.submitEventObj = this._getSubmitObj();
    this._macroApi
      .editEvent$(id, this.submitEventObj, 'region')
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
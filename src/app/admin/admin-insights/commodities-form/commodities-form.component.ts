import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, NgForm } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommodityService } from '../../../services/insights/commodity.service';
import { ToastsManager } from 'ng2-toastr';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv';

import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';

export class CommoditiesModel {
  constructor(
    public name: string,
    public createdBy: number,
    public id?: number) {
  }
}
export class FormCommoditiesModel {
  constructor(
    public name: string,
    public createdBy: number) {
  }
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
class Commodities {
  id: number;
  name: string;
  createdBy: number
}
@Component({
  selector: 'app-commodities-form',
  templateUrl: './commodities-form.component.html',
  styleUrls: ['./commodities-form.component.css']
})
export class CommoditiesFormComponent implements OnInit {
  // public commodities: CommoditiesModel;
  @Input() event: CommoditiesModel;
  createform: boolean = false;
  formEvent: FormCommoditiesModel;
  submitEventObj: CommoditiesModel;
  commoditiesForm: FormGroup;
  submitEventSub: any;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  private allItems: {};
  dtOptions: DataTables.Settings = {};
  error: boolean;
  private apiEvents = [];
  commodities: Commodities[];
  popupid:number;
  commoditiespopup = [];
  showModel:boolean=false;
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;


  constructor(private fb: FormBuilder,
    private _commoditiesService: CommodityService,
    public toastr: ToastsManager,
    private route: Router,
    private _utils: UtilsService,
    private http: HttpClient) {

      this.commoditiesForm = new FormGroup({
        name: new FormControl(),
      });
  }
  ngOnInit() {

    this.getCommodities()
    this.createform = false;
    this.commoditiesForm = this.fb.group({
      name: ['', Validators.required],
    });
    // this.formEvent = this._setFormEvent(); 
  }

  private _setFormEvent() {
    return new FormCommoditiesModel(
      this.event.name,
      this.event.createdBy,
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

 public getCommodities(){
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
       
        var myEfficientFn = this._utils.debounce(() => {
          let apiEvent = this._commoditiesService.filterCommodities$(dataTablesParameters, 'filterCommodities')
            .subscribe(resp => {
              that.commodities = resp.data;
              // that.commodities = (that.commodities).concat(resp.data);   
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
        { data: 'createdBy' },
        { data: 'id' }
      ]
    };
  }
  private _getSubmitObj() {
    let curUserObj = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(curUserObj);
    return new CommoditiesModel(
      this.commoditiesForm.get('name').value,
      currentUser.user.userid
    );
  }

  create() {
    this.createform = true;
  }

  download() {
    this._commoditiesService.getCommodities()
      .subscribe(data => {
        //API data
        this.allItems = this.commodities;
        var options = {

          headers: ['ID', 'Name', 'CreatedBy']
        };


        new Angular2Csv(this.allItems, 'CommoditiesList', options);

      });
  }

  deleteCommodity(id: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {
      let apiEvent = this._commoditiesService.deleteCommodityById$(id)
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
      let pos = this.commodities.map(function (e) { return e.id; }).indexOf(id);
      this.commodities.splice(pos, 1);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }

  }
  modelopen(id)
  {
    this.popupid=id;
    this.commoditiespopup = [];
    this.getCommoditiesById();
    this.showModel=true;
  }

  private getCommoditiesById(append=true){
    this._commoditiesService
    .getCommoditiesById$(this.popupid)
    .subscribe(
      res => {
        if(res.success){
           this.commoditiespopup= res.data;  
        }          
      },
      err => {
        this.error = true;
      }
    );
  }
  savecommodities() {
    this.submitEventObj = this._getSubmitObj();
    this._commoditiesService
      .postEvent$(this.submitEventObj)
      .subscribe(
        data => {
          this._handleSubmitSuccess(data);
          this.rerender();
          if(data.success){
            (this.commodities).push(data.data);
          }     
        },
        err => this._handleSubmitError(err)
      );
  }
  updatecommodities(id) {
    this.submitEventObj = this._getSubmitObj();
    this._commoditiesService
    .editEvent$(id, this.submitEventObj)
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
      $(function(){$('button.close').trigger('click');
      that.showModel=false;
      that.createform = false;
    });
     
    }
    else {
      this.toastr.error(res.message, 'Invalid');
      // this.createform = false;
    }

  }

  private _handleSubmitError(err) {
    this.toastr.error(err.message, 'Error');
    // this.showModel=false;
  }
}

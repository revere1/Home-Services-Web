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
import { UtilsService } from '../services/utils.service';
import { MacroTypeService } from '../services/macrotype.service';
import { BreadcrumbsService, IBreadcrumb } from 'ng2-breadcrumbs';


export class UsersModel {
  constructor(
    public mobile: string,
    public id?: number) {
  }
}
export class UsersFormModel {
  constructor(public mobile: string) {

  }
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit,AfterViewInit {
  
  @Input() event: UsersModel;
  createform: boolean = false;
  formEvent: UsersFormModel;
  submitEventObj: UsersModel;
  signupForm: FormGroup;
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
    this.signupForm = new FormGroup({
      mobile: new FormControl(),
    });
  }

  ngOnInit() {
    this.createform = false;
    this.signupForm = this.fb.group({
      mobile: ['', Validators.required],
    });
  }

  private _setFormEvent() {
    return new UsersFormModel(
      this.event.mobile
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

  private _getSubmitObj() {
    return new UsersModel(
      this.signupForm.get('mobile').value
    );
  }

  create() {
    this.createform = true;
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
    this.showModel = true;
  }


  saveUsers() {
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
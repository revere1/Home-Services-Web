import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from '../../../../env.config';
import { UtilsService } from '../../../../services/utils.service';
import { ToastsManager } from 'ng2-toastr';
import { Angular2Csv } from 'angular2-csv';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { CompanyService } from '../../../../services/company.service';
import { BreadcrumbsService, IBreadcrumb} from 'ng2-breadcrumbs';

class Company {
  name: string;
  website: string;
  about:string; 
  id: number;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-analyst-companies-list',
  templateUrl: './analyst-companies-list.component.html',
  styleUrls: ['./analyst-companies-list.component.css']
})
export class AnalystCompaniesListComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  private allItems: {};
  companies: Company[];
  error: boolean;
  apiEvents = [];
  public bcList :IBreadcrumb[];
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  constructor(private http: HttpClient,
    private router: Router,  
    private _companyapi:CompanyService,
    private breadcrumbsService:BreadcrumbsService,
    private _utils: UtilsService,
    private meta: Meta,
    public toastr: ToastsManager) {
    this.meta.addTag({ name: 'description', content: 'All the list of tickers' });
    this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
    this.meta.addTag({ name: 'keywords', content: 'tickers, revere, equity' });
  }
  ngOnInit(): void {

    this.bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Analyst Companies' , url: 'analyst-companies', params: []}];
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
          let apiEvent = this._companyapi.filterCompanies$(dataTablesParameters, 'filterCompanies')
            .subscribe(resp => {
              that.companies = resp.data;
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
        { data: 'website' },         
        { data: 'createdBy' },            
        { data: 'id' }
      ]
    };
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
  download() {
    this._companyapi.getcompanies$()
      .subscribe(data => {
        //API data
        this.allItems = this.companies;
        var options = {
          headers: ['ID', 'Name', 'website','CreatedBy']
        };
        new Angular2Csv(this.allItems, 'ComapaniesList', options);
      });
  }



  deleteTicker(id: number) {
    var delmsg = confirm("Are u Sure Want to delete?");
    if (delmsg) {
      let apiEvent = this._companyapi.deleteCompanyById$(id)
        .subscribe(
          data => {
            this._handleSubmitSuccess(data, id);
          },
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
      let pos = this.companies.map(function (e) { return e.id; }).indexOf(id);
      this.companies.splice(pos, 1);
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
      })

    }

  }
}


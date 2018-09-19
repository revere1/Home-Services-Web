import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ENV } from '../../../env.config';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../services/utils.service';
import { ToastsManager } from 'ng2-toastr';
import { Angular2Csv } from 'angular2-csv';
import { BreadcrumbsService,IBreadcrumb } from 'ng2-breadcrumbs';
class Person {
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  createdBy: string;
  id: number;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit, OnDestroy {


  allItems = [];
  dtOptions: DataTables.Settings = {};

  persons: Person[];
  error: boolean;

  private apiEvents = [];
  public bcList :IBreadcrumb[];
  constructor(private http: HttpClient,
    private _userApi: UserService,
    private _utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService,
    private meta: Meta,
    public toastr: ToastsManager) {
    this.meta.addTag({ name: 'description', content: 'All the list of clients' });
    this.meta.addTag({ name: 'author', content: ENV.AUTHOR });
    this.meta.addTag({ name: 'keywords', content: 'clients, revere, equity' });
  }

  ngOnInit(): void {

    this.bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Clients' , url: 'clients', params: []}];
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
          let apiEvent = this._userApi.filterUsers$(dataTablesParameters, 'filterClients')
            .subscribe(resp => {
              that.persons = resp.data;
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
        { data: 'first_name' },
        { data: 'last_name' },
        { data: 'email' },
        { data: 'contact_number' },
        { data: 'createdBy' },
        // { data: 'updatedBy' },
        { data: 'id' }
      ]
    };
  }

  // download() {
  //   this.allItems = this.persons;
  //   this._userApi.getClient$()
  //     .subscribe(data => {
        
  //       var options = {
         
  //         headers: ['ID', 'First_name', 'Last_name', 'Email', 'Contact_number', 'CreatedBy']
  //       };
  //       new Angular2Csv(this.allItems, 'ClientList', options);
  //     });
  // }


  // deleteClient(id: number) {
  //   var delmsg = confirm("Are u Sure Want to delete?");
  //   if (delmsg) {
  //     let apiEvent = this._userApi.deleteClientById$(id)
  //       .subscribe(
  //         data => this._handleSubmitSuccess(data, id),
  //         err => this._handleSubmitError(err)
  //       );

  //     (this.apiEvents).push(apiEvent);
  //   }
  // }
  private _handleSubmitSuccess(res, id = 0) {
    this.error = false;

    // Redirect to event detail
    if (res.success) {
      this.toastr.success(res.message, 'Success');
      let pos = this.persons.map(function (e) { return e.id; }).indexOf(id);
      this.persons.splice(pos, 1);
    }
    else {
      this.toastr.error(res.message, 'Invalid');
    }

  }


  private _handleSubmitError(err) {

    this.toastr.error(err.message, 'Error');

    this.error = true;
  }

  public ngOnDestroy() {
    if ((this.apiEvents).length) {
      this.apiEvents.forEach(val => {
        val.unsubscribe();
      })
    }
  }

}

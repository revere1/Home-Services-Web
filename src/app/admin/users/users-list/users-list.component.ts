import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { UserService } from '../../../services/user.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  public users:any[] = [];
  dtOptions: DataTables.Settings = {};
  error:boolean;
  apiEvents = [];
  constructor(
    private _utils: UtilsService,
    private _userService:UserService,
    public toastr: ToastsManager
  ) { }

  ngOnInit() {

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        var myEfficientFn = this._utils.debounce(()=>{           
           let apiEvent= this._userService.filterUsers$(dataTablesParameters,'filterUsers')
            .subscribe(resp => {
              that.users = resp.data;  
              console.log(that.users)
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });   
            (this.apiEvents).push(apiEvent);      
        },1000,false);

        myEfficientFn();       
      },
      columns: [
            { data: 'user_name' },
            { data: 'user_email' },
            { data: 'status' },
            { data: 'createdAt' },
            { data: 'id' }
          ]
    };
  }

  deletesUser(id:number)
  {
    var delmsg = confirm("Are u Sure Want to delete?");
    if(delmsg)
    {  
      let apiEvent=this._userService.deleteUserById$(id)
      .subscribe(
        data => this._handleSubmitSuccess(data,id),
        err => this._handleSubmitError(err)
      );
      (this.apiEvents).push(apiEvent);
    }
  }
  private _handleSubmitSuccess(res,id=0)
  {
    this.error = false;
  
    // Redirect to event detail
    if(res.success){
      this.toastr.success(res.message,'Success');  
      let pos = this.users.map(function(e) { return e.id; }).indexOf(id);
      this.users.splice(pos, 1);
    }
    else{       
      this.toastr.error(res.message,'Invalid');  
    }
   
  }


  private _handleSubmitError(err)
  {
    this.toastr.error(err.message,'Error');
  
    this.error = true;
  }
}

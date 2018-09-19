import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { UserService } from '../../../services/user.service';
import { UsersModel } from '../../../models/users.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbsService } from 'ng2-breadcrumbs';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  users : UsersModel;
  private id: number;
  routeSub: Subscription;
  loading: boolean;
  categoriesSub: Subscription;
  error: boolean;

  constructor(
    public utils: UtilsService,
    private _userService:UserService,
    private route: ActivatedRoute,
    private breadcrumbsService:BreadcrumbsService

  ) { 


  }

  ngOnInit()
  {
     /*BreadCrumb*/
     let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Users' , url: 'users', params: []},
     {label: 'Update' , url: 'update', params: []}];
      this.utils.changeBreadCrumb(bcList);
      this.utils.currentBSource.subscribe(list => {
        this.breadcrumbsService.store(list);
      });
   /*End - BreadCrumb*/
      this.routeSub = this.route.params
      .subscribe(params => {
      this.id = params['id'];
      this._getUsers();
      });
  }

private _getUsers()
{
    this.loading = true;
    // GET event by ID
    this.categoriesSub = this._userService
    .getUserById$(this.id)
    .subscribe(
    res => {
    if(res.success){
    
      this.users= res.data;         
    }          
    this.loading = false;
    },
    err => {
    this.loading = false;
    this.error = true;
    }
    );
}

ngOnDestroy()
{
  this.routeSub.unsubscribe();
  //this.tabSub.unsubscribe();
  this.categoriesSub.unsubscribe();
}
}


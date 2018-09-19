import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService } from 'ng2-breadcrumbs';
import { UtilsService } from '../../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user_details:any;
  user:any;
  addresses:any;
  id: number;
  private sub: any;
  constructor(private breadcrumbsService:BreadcrumbsService,
              private _utils:UtilsService,
              private route: ActivatedRoute,
              private _userService:UserService
            ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
   });
      /*BreadCrumb*/
      let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Users' , url: 'users', params: []},
      {label: 'Details of user '+this.id , url: 'view', params: []}];
    this._utils.changeBreadCrumb(bcList);
    this._utils.currentBSource.subscribe(list => {
      this.breadcrumbsService.store(list);
    });
    /*End - BreadCrumb*/
     this._userService.getUserDetails(this.id).subscribe(resp => {
      // this.user_details = resp;
      if(resp.success){
      this.user = resp.user;
      this.addresses = resp.addresses
      }else{
        this.user = {};
        this.addresses = [];
      }
    });
    // this.user = {'user_name':'Test','user_email':'test@gmail.com'}
    // this.addresses = [
    //                   {contact_number:'9963083185',company:'Anagha Softech',address1:'H.No: 8-2-608/27',address2:'Mastan Mansion',city:'Hyderabad',state:'TS',country:'India',postal_code:'500034'},
    //                   {contact_number:'9963083185',company:'Anagha Softech',address1:'H.No: 8-2-608/27',address2:'Mastan Mansion',city:'Hyderabad',state:'TS',country:'India',postal_code:'500034'},
    //                   {contact_number:'9963083185',company:'Anagha Softech',address1:'H.No: 8-2-608/27',address2:'Mastan Mansion',city:'Hyderabad',state:'TS',country:'India',postal_code:'500034'},
    //                   {contact_number:'9963083185',company:'Anagha Softech',address1:'H.No: 8-2-608/27',address2:'Mastan Mansion',city:'Hyderabad',state:'TS',country:'India',postal_code:'500034'},
                     
    //                  ];
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

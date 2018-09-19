import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-users-about',
  templateUrl: './users-about.component.html',
  styleUrls: ['./users-about.component.css']
})
export class UsersAboutComponent implements OnInit {
  private currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public user: any;
  private routeSub:any;
  public id:any;
  constructor(private _userapi: UserService,
              private route:ActivatedRoute,
              private auth : AuthService) { 
                auth.loadSession();
              }

  ngOnInit() {
    this.routeSub = this.route.parent.params
    .subscribe(params => {
      this.id = params['id'];
    });
    this._userapi.getUserById$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.user = data.data;
   
      }
    });
  }

}



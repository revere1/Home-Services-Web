import { Component, OnInit} from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { ENV } from '../../../env.config';
import { AuthService } from '../../../services/auth.service';
import { Meta } from '@angular/platform-browser';
import { InsightService } from '../../../services/insights/insight.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-users-layout',
  templateUrl: './users-layout.component.html',
  styleUrls: ['./users-layout.component.css'],

})
export class UsersLayoutComponent implements OnInit {
  private currentUser = JSON.parse(localStorage.getItem('currentUser'))
  public user : any;
  private routeSub:any;
  public role:any;
  public id:any;
  selectedIndex:any;  
  public viewCount : any;
  public insCount : any;
  public serverURL = ENV.SERVER_URL;
  private userInsights : any;
  public followersCount : any;
  
  constructor(private _userapi:UserService,
              private _insightApi : InsightService,
              private _utils: UtilsService,
              private route:ActivatedRoute,
              private meta: Meta,
              private auth : AuthService,
              private router : Router,
              private toastr : ToastsManager) {
                this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.addTag({ name: 'twitter:site', content: '@revere' });
    this.meta.addTag({ name: 'og:url', content: 'http://revereui.s3-website.eu-west-2.amazonaws.com/#/insights/preview/23' });
    this.meta.addTag({ name: 'og:title', content: 'EASTW: Water Monopoly to Ride Wave of Growth Along Eastern Seaboard : Reveressss' });
    this.meta.addTag({ name: 'og:description', content: 'PTT Wants to Build Your Next Train! Intuitively speaking, the national oil company isnt the first company that comes to mind when Thailand needs a new train, but that didnt stop PTT Group from sending two of their subsidiaries'});
    this.meta.addTag({ name: 'og:image', content: 'http://ec2-35-178-115-252.eu-west-2.compute.amazonaws.com:1332/summary-note-images/2855f9d349d156ee296c235119b339cc-g1.png' });
    
                auth.loadSession();
               }

  ngOnInit() {

    if(!this.currentUser){
            
    }
    else{
     
    }
    
    this.routeSub = this.route.params
    .subscribe(params => {
      this.id = params['id'];
    });
    this._userapi.getUserById$(this.id).subscribe(data =>{
      if(data.success === false){
      }else{
        this.user = data.data;
        // this.company = this.user.companyName
        console.log(this.user)
      }
    });
    // if(this.currentUser){
    //   this._userapi.getRoleByAccess$(this.currentUser.user.access_level).subscribe(data => {
    //     if(data.success === false){
    //     }else{
    //       this.role = data.data.name;
    //     }
    //   })
    // }
    this._insightApi.userInsightsCount$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.userInsights = data.data;
        this.viewCount = (this.userInsights.insights_view)?this.userInsights.insights_view.viewCount : 0;
        this.insCount = (this.userInsights.insCount)?this.userInsights.insCount : 0;
      }
    });
    this._insightApi.userFollowersCount$(this.id).subscribe(data => {
      if (data.success === false) {
      } else {
        this.followersCount = data.data;
      }
    });
  }
addFollowers(userId: number){
  if(this.currentUser){
    let followerObj = {
      'analyst_id':userId,
      'followedBy':this.currentUser.user.userid
    }
   
  }else{
    this.router.navigate(['/auth/login'])
  }
}
  select(index: any) {
    this.selectedIndex = index;
  }


}

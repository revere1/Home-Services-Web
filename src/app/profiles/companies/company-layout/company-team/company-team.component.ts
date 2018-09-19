import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { CompanyService } from '../../../../services/company.service';
import { ENV } from '../../../../env.config';
@Component({
  selector: 'app-company-team',
  templateUrl: './company-team.component.html',
  styleUrls: ['./company-team.component.css']
})
export class CompanyTeamComponent implements OnInit {
  public users: any;
  private routeSub: any;
  public company: any;
  private companyId : any;
  public serverURL = ENV.SERVER_URL;
  constructor(private _userapi: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private _companyApi: CompanyService,
    private auth:AuthService) {
      auth.loadSession();
     }

  ngOnInit() {
    this.routeSub = this.route.parent.params
      .subscribe(params => {
        this.company = params['company'];
      });
      this._companyApi.getCompanyByName$(this.company).subscribe(data => {
        if (data.success === false) {
        } else {
          this.companyId =  data.data.id;
          // comapny team by company id
          
        }
      });
  }

  selectUser(id) {
    this.router.navigateByUrl(`/profile/` + id);
  }

}

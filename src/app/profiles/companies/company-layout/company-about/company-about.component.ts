import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { CompanyService } from '../../../../services/company.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-about',
  templateUrl: './company-about.component.html',
  styleUrls: ['./company-about.component.css']
})
export class CompanyAboutComponent implements OnInit {
  public companyDetails: any;
  private routeSub: any;
  private company : any;
  private companyId : any;

  constructor(private auth : AuthService,
    private _companyApi: CompanyService,
    private route: ActivatedRoute) { 
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
        this.companyDetails = data.data;
      }
    })
  }

}

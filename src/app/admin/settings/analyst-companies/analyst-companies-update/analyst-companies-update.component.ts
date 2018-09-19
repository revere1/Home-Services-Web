import { Component, OnInit,OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../../../../services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CompanyModel} from '../../../../models/company_details.model';
import { CompanyService } from '../../../../services/company.service';
import { BreadcrumbsService } from 'ng2-breadcrumbs';


@Component({
  selector: 'app-analyst-companies-update',
  templateUrl: './analyst-companies-update.component.html',
  styleUrls: ['./analyst-companies-update.component.css']
})
export class AnalystCompaniesUpdateComponent implements OnInit {

  pageTitle = 'Update Event';
  routeSub: Subscription;
  private id: number;
  loading: boolean;
  companySub: Subscription;
  company: CompanyModel;
  error: boolean;

  constructor(
    private route: ActivatedRoute,    
    private title: Title,
    private _companyapi:CompanyService, 
    private breadcrumbsService:BreadcrumbsService,
    public utils: UtilsService
  ) { }

  ngOnInit() {

           /*BreadCrumb*/
           let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'Analyst Companies' , url: 'settings/analyst-companies', params: []},
           {label: 'Update' , url: 'update', params: []}];
         this.utils.changeBreadCrumb(bcList);
         this.utils.currentBSource.subscribe(list => {
           this.breadcrumbsService.store(list);
         });
         /*End - BreadCrumb*/
   

    this.title.setTitle(this.pageTitle);
    // Set event ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getCompany();
      });
  }


  private _getCompany() {
    this.loading = true;
    // GET event by ID
    this.companySub = this._companyapi
      .getCompanyById$(this.id)
      .subscribe(
        res => {
          if(res.success){
            this.company = res.data; 
          }          
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.error = true;
        }
      );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();  
    this.companySub.unsubscribe();
  }

}


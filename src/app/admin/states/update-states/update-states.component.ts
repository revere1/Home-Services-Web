import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { StatesModel } from '../../../models/states.model';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { StatesService } from '../../../services/states.service';
import { BreadcrumbsService } from 'ng2-breadcrumbs';

@Component({
  selector: 'app-update-states',
  templateUrl: './update-states.component.html',
  styleUrls: ['./update-states.component.css']
})
export class UpdateStatesComponent implements OnInit {
  loading: boolean;
  // private id: number;
  // states : StatesModel;
  // routeSub: Subscription;
  // statesSub: Subscription;
  // error:boolean;
  states: StatesModel;
  routeSub: Subscription;
  private id: number;
  stateSub: Subscription;
  error: boolean;
  constructor( private route: ActivatedRoute,    

    private _statesapi: StatesService,
    public utils: UtilsService,
    private breadcrumbsService:BreadcrumbsService) { }

  ngOnInit() {
   
           /*BreadCrumb*/
           let bcList = [{label: 'Home' , url: 'home', params: []},{label: 'States' , url: 'states', params: []},
           {label: 'Update' , url: 'update', params: []}];
         this.utils.changeBreadCrumb(bcList);
         this.utils.currentBSource.subscribe(list => {
           this.breadcrumbsService.store(list);
         });
         /*End - BreadCrumb*/
    // Set event ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getState();
      });
  }
  private _getState() {
    this.loading = true;
    // GET event by ID
    this.stateSub = this._statesapi
      .getStatesById$(this.id)
      .subscribe(
        res => {
          if(res.success){
            this.states = res.data;         
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
    //this.tabSub.unsubscribe();
    this.stateSub.unsubscribe();
  }
}

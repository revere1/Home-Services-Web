import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ENV } from '../env.config';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent implements OnInit {
  routeSub: Subscription;
  public id: number;
  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  public searchResults = [];
  public hint: string = null;
  public showHint: boolean = true;
  public serverURL = ENV.SERVER_URL;

  constructor(
    private _user: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.stateCtrl = new FormControl();
    this.stateCtrl.valueChanges.subscribe(val => {
      this.filterStates(val)
    })
    this.stateCtrl.setValue('');
  }
  ngOnInit() {
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id']
      });
  }

  onInsSelectionChanged(item) {
    this.router.navigateByUrl(`/insights/preview/` + item.id)
    this.stateCtrl.setValue('');
  }

  onUserSelectionChange(item) {
    this.router.navigateByUrl(`/profile/` + item.id)
    this.stateCtrl.setValue('');
  }
  onTickerSelection(item) {
    this.router.navigateByUrl(`/ticker/` + item.id)
    this.stateCtrl.setValue('');
  }
  filterStates(name: string) {
    this._user.globalSearch(name).subscribe(data => {
      if (data.success) {
        this.searchResults = [data.data];
      }
      else {
        this.searchResults = [];
        this.hint = data.message;
      }
    });
  }
}

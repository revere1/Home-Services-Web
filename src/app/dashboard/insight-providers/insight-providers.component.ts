import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-providers',
  templateUrl: './insight-providers.component.html',
  styleUrls: ['./insight-providers.component.css']
})
export class InsightProvidersComponent implements OnInit {
  public tabSelection : any = 'trending';
  constructor() { }

  ngOnInit() {
  }
  select(tabName){
    this.tabSelection = tabName;
   }
}

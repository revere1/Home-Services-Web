import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {
  public tabSelection : any = 'trending';
  constructor() { }

  ngOnInit() {
  }
  
  select(tabName){
   this.tabSelection = tabName;
  }
}

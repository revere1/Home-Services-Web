import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-providers-trending',
  templateUrl: './insight-providers-trending.component.html',
  styleUrls: ['./insight-providers-trending.component.css']
})
export class InsightProvidersTrendingComponent implements OnInit {

  public trendingInsights = [];
  constructor() { }

  ngOnInit() {
  }

}

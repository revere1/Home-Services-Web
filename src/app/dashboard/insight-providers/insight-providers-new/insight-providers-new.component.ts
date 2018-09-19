import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-providers-new',
  templateUrl: './insight-providers-new.component.html',
  styleUrls: ['./insight-providers-new.component.css']
})
export class InsightProvidersNewComponent implements OnInit {
  public trendingInsights = [];
  constructor() { }

  ngOnInit() {
  }

}

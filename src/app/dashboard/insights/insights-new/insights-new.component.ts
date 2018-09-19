import { Component, OnInit } from '@angular/core';
import { InsightService } from '../../../services/insights/insight.service';
import { ENV } from '../../../env.config';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-insights-new',
  templateUrl: './insights-new.component.html',
  styleUrls: ['./insights-new.component.css']
})
export class InsightsNewComponent implements OnInit {
  public newInsights:any;
  public serverUrl = ENV.SERVER_URL;
  constructor(private insightApi:InsightService,
              private _utils:UtilsService) { }

  ngOnInit() {
    this.insightApi.getNewInsights$().subscribe(data => {
      if(data.success == false){

      }else{
        this.newInsights = data.data;
      }
    })
  }

}

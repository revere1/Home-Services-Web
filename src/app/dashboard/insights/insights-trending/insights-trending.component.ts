import { Component, OnInit } from '@angular/core';
import { InsightService } from '../../../services/insights/insight.service';
import { ENV } from '../../../env.config';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-insights-trending',
  templateUrl: './insights-trending.component.html',
  styleUrls: ['./insights-trending.component.css']
})
export class InsightsTrendingComponent implements OnInit {
  public trendingInsights : any;
  public serverURL = ENV.SERVER_URL;
  public enableShareButton : any;
  public show : any;
  constructor(private insightsApi : InsightService,
              public _utils:UtilsService) { }

  ngOnInit() {  
    this.insightsApi.getTrendingInsights$().subscribe(data => {
      if(data.success == false){
      }else{
        this.trendingInsights  = data.data;
      }
    })
  }
  enableshare(i){
    this.enableShareButton = i;
    this.show = null;
  }
  share(index){
    this.show = index;
  }
}

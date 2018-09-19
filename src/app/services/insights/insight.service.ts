import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../../env.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class InsightService {

  private currentUser : any;
  constructor(private http: HttpClient,private router: Router) { }

  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser){
      return this.currentUser.token;
    }
    return 'revere';
  }

  getToken(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }
  createInsight(event){
    return this.http
    .post(`${ENV.BASE_API}create-insight`, event, {
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
  }

  getCurUser(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.user.userid;
  }
  getInsightById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}insights/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  getInsights$(user:number) {
    return this.http
      .get(`${ENV.BASE_API}ins/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  getLatestComapanyInsights$(companyId:any){
    return this.http
    .get(`${ENV.BASE_API}latest-insight/${companyId}`, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
  getComapanyInsights$(companyId:any){
    return this.http
    .get(`${ENV.BASE_API}insight/${companyId}`, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
  getWatchedList$(userId){
    return this.http
    .post(`${ENV.BASE_API}watch-list`, {'currentUserId':userId},{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
  getPrivillagesUsers$(userId){
    return this.http
    .post(`${ENV.BASE_API}privillages`, {'currentUserId':userId},{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
  getResearchInsightUsers$() {
    return this.http
      .get(`${ENV.BASE_API}research-insights`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  editEvent$(id: number,event){    
    return this.http
      .put(`${ENV.BASE_API}updateinsight/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  elasticInsights(term){
    return this.http
      .get(`${ENV.BASE_API}elastic/insights?term=`+term, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  elasticTickers(term){
    return this.http
      .get(`${ENV.BASE_API}elastic/tickers?term=`+term, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  getInsightsCount(userId,status) {
    return this.http
    .post(`${ENV.BASE_API}status-count`,{'currentUserId' : userId ,'statuses':status },{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError)
  }
  getEditorierInsightsCount(userId,status) {
    return this.http
    .post(`${ENV.BASE_API}editorier-status-count`,{'currentUserId' : userId ,'statuses':status },{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError)
  }

  getTrendingInsights$(){
    return this.http
    .get(`${ENV.BASE_API}trending-insights`, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
  getNewInsights$() {
    return this.http
      .get(`${ENV.BASE_API}new-insights`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  getInsightsForVertical$(user:number) {
    return this.http
      .get(`${ENV.BASE_API}userVertical/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  getCompInsightsForVertical$(companyId:string) {
    return this.http
      .get(`${ENV.BASE_API}companyVertical/${companyId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  getInsightsForSectorDist$(user:number) {
    return this.http
      .get(`${ENV.BASE_API}userSectorDist/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  getCompInsightsForSectorDist$(companyId:any) {
    return this.http
      .get(`${ENV.BASE_API}companySectorDist/${companyId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  userInsightsCount$(user:number) {
    return this.http
      .get(`${ENV.BASE_API}userInsCount/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  companyInsightsCount$(companyId:number) {
    return this.http
      .get(`${ENV.BASE_API}companyInsCount/${companyId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  userFollowersCount$(user:number) {
    return this.http
      .get(`${ENV.BASE_API}userFollowCount/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  companyFollowersCount$(user:number) {
    return this.http
      .get(`${ENV.BASE_API}compFollowCount/${user}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.router.navigate(['/auth/login']);
    }
    return Observable.throw(errorMsg);
  }
}

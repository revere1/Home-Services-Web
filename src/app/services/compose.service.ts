import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ComposeModel } from '../models/compose.model';
import { InsightCommentModel } from '../models/insightcomment.model';

@Injectable()
export class ComposeService {
  private currentUser : any = JSON.parse(localStorage.getItem('currentUser'));
  constructor(private http: HttpClient,private router: Router) {   }

  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser){
      return this.currentUser.token;
    }
      return 'revere';
  }

   public getToken(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }
    //getHelpById$(createdBy: number): Observable<HelpModel> {
      getComposeById$(id: number) {
        return this.http
          .get(`${ENV.BASE_API}insights/${id}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
          })
          .catch(this._handleError);
      }


      //delete insights
      deleteInsightById$(id: number): Observable<number>{
        return this.http
          .delete(`${ENV.BASE_API}insight/${id}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
          })
          .catch(this._handleError);
      }
      //delete insights-attachments
      deleteInsAttachmentById$(id: number): Observable<number>{
        return this.http
          .delete(`${ENV.BASE_API}insight-attachment/${id}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
          })
          .catch(this._handleError);
      }
  // POST new event (admin only)
  filterInsights$(filterInput,endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

   editEvent$(id: number, event): Observable<ComposeModel> {    
    return this.http
      .put(`${ENV.BASE_API}updateinsight/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  removeFile(file){
    return this.http
      .delete(`${ENV.BASE_API}problems/remove-file`, {
        headers: new HttpHeaders()
                  .set('Authorization', this._authHeader)
                  .set('file', file)
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

  uploads(formData) {

    return this.http
    .post(`${ENV.BASE_API}insights/files`, formData,{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }


  public publishEvent$(obj){
    return  this.http
      .put(`${ENV.BASE_API}publish-insight`, obj , {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  };   
    //postEvents$(id:number,event: HelpCommentModel): Observable<HelpCommentModel> {
      postEvents$(id:number,event: InsightCommentModel) {
        return this.http
          .post(`${ENV.BASE_API}insight_comments/${id}`, event, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
          })
          .catch(this._handleError);
      }

        //getHelpcommentById$(id: number): Observable<HelpCommentModel> {
    getInsightcommentById$(id: number,filterInput={}){
      return this.http
      .post(`${ENV.BASE_API}insights_commentsreply/${id}`, filterInput, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);    
  }
  getInsightcommentsById$(id: number,filterInput){
    return this.http
    .post(`${ENV.BASE_API}insights_commentsreply/${id}`, filterInput, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);    
}

    //getHelpById$(createdBy: number): Observable<HelpModel> {
      getInsightById$(from: number) {
        return this.http
          .get(`${ENV.BASE_API}insight/${from}`, {
            headers:new HttpHeaders().set('Authorization', this._authHeader)
          })
          .catch(this._handleError);
      }


  public insightView$(viewObj){
    return this.http
    .post(`${ENV.BASE_API}insight-views`, viewObj,{
      headers:new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  } 
  
  public  insightViewsCount$(id:number){
    return this.http
    .get(`${ENV.BASE_API}ins-views-count/${id}`,{
      headers:new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  } 
  public  insightCommentsCount$(id:number){
    return this.http
    .get(`${ENV.BASE_API}ins-comments-count/${id}`,{
      headers:new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  } 
  
  public insightAddwatchlist$(viewObj){
    return this.http
    .post(`${ENV.BASE_API}add-to-watchlist`, viewObj,{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  } 
  public addInsightRating(rateObj){
    return this.http
    .post(`${ENV.BASE_API}insight-client-rating`, rateObj,{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }

  public getInsightRating(rateObj){
    return this.http
    .post(`${ENV.BASE_API}get-insight-rating`, rateObj,{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
}



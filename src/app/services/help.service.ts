import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { HelpModel } from '../models/help.model';
import { HelpCommentModel } from '../models/helpcomment.model';
@Injectable()
export class HelpService {
  private currentUser : any;
  constructor(private http: HttpClient,private router: Router) { }

  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }



  // GET list of public, future events
  //getUserById$(id: number): Observable<ClientModel> {

  // POST new event (admin only)
  postEvent$(event: HelpModel): Observable<HelpModel> {
    return this.http
      .post(`${ENV.BASE_API}problems`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  //postEvents$(id:number,event: HelpCommentModel): Observable<HelpCommentModel> {
    postEvents$(id:number,event: HelpCommentModel) {
    return this.http
      .post(`${ENV.BASE_API}problem_comments/${id}`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  // POST new event (admin only)
  filterProblems$(filterInput,endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  uploads(formData) {

    return this.http
    .post(`${ENV.BASE_API}help/files`, formData,{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }

  public getToken(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }
  
  public getUserId() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.user.userid;
  }

  public updateAllUnread(pid,uid){
    return this.http
      .put(`${ENV.BASE_API}problems-comments`, {problemId:pid,msgTo:uid}, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }


  
  editEvent$(id: number, event: HelpModel): Observable<HelpModel> {    
    return this.http
      .put(`${ENV.BASE_API}problems/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  //getHelpById$(createdBy: number): Observable<HelpModel> {
    getHelpById$(createdBy: number) {
    return this.http
      .get(`${ENV.BASE_API}problems/${createdBy}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  //getHelpcommentById$(id: number): Observable<HelpCommentModel> {
    getHelpcommentById$(id: number,filterInput){
      return this.http
      .post(`${ENV.BASE_API}problems_commentsreply/${id}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);    
  }

  getAComment$(id: number){
    return this.http
      .get(`${ENV.BASE_API}problem-comment/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }


  // getHelpcommentByMsgTo$(problemId: number): Observable<HelpCommentModel> {
  //   return this.http
  //     .get(`${ENV.BASE_API}problem_commentsre/${problemId}`, {
  //       headers: new HttpHeaders().set('Authorization', this._authHeader)
  //     })
  //     .catch(this._handleError);
  // }


  getUserById$(createdBy: number,id:number) {
    return this.http
      .get(`${ENV.BASE_API}user/${createdBy}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  problemsCount$(id: number) {
    return this.http
      .post(`${ENV.BASE_API}fetch-helpcounts/${id}`, {}, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  ProblemsUserList$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}problemUser-list/${id}`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  problemById$(id: number): Observable<HelpModel> {
    return this.http
      .get(`${ENV.BASE_API}problems/${id}`, {
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

  // upload(formData, id) {
  //   let headers = new HttpHeaders();
  //   //headers.set('Authorization', this._authHeader);
  //   //headers.set('Content-Type', 'application/json');
  //   let options = {
  //     headers: headers
  //   };

  //   return this.http
  //   .post(`${ENV.BASE_API}user/profile-pic`, formData)
  //   .catch(this._handleError);
  // }

  
}

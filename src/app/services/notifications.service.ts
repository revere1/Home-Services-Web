import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class NotificationService {

    private currentUser : any;
    constructor(private http: HttpClient,private router: Router) { }
    private get _authHeader(): string {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return this.currentUser.token;
      }
      
  notificationsCount$(id){
    return this.http
    .post(`${ENV.BASE_API}notifications-counts/${id}`, {},{
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
  }

  public notification(submittingObj){
    return  this.http
      .post(`${ENV.BASE_API}create-notification`, submittingObj,{
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  public orgCopy(orgCopyObj){
    return  this.http
      .post(`${ENV.BASE_API}org-copy`, orgCopyObj,{
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  filterNotifications$(filterInput,endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
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



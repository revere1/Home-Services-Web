import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { StatesModel } from '../models/states.model';
@Injectable()
export class StatesService {

  private currentUser : any;

  constructor(private http: HttpClient,private router: Router) { }

  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  getStates$() {
    return this.http
      .get(`${ENV.BASE_API}states`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  
  
  // POST new event (admin only)
  getState$(country_id: number) {
    return this.http
      .get(`${ENV.BASE_API}states?country_id=${country_id}`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
// POST new event (admin only)
postEvent$(event: StatesModel): Observable<StatesModel> {
  return this.http
    .post(`${ENV.BASE_API}states`, event, {
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
}
  // PUT existing event (admin only)
  editEvent$(id: number, event: StatesModel): Observable<StatesModel> {    
    return this.http
      .put(`${ENV.BASE_API}states/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
    // POST new event (admin only)
    filterStates$(filterInput,endPoint) {
      return this.http
        .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
          headers: new HttpHeaders().set('authorization', this._authHeader)
        })
        .catch(this._handleError);
    }

  // GET list of public, future events
  //getStatesById$(id: number): Observable<StatesModel> {
    getStatesById$(id: number){
    return this.http
      .get(`${ENV.BASE_API}states/${id}`, {
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
  
  deleteStateById$(id:number):Observable<number>{
    return this.http
    .delete(`${ENV.BASE_API}states/${id}`, {
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
}

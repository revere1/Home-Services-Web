import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { CountriesModel } from '../models/countries.model';
@Injectable()
export class CountriesService {

  private currentUser : any;

  constructor(private http: HttpClient,private router: Router) { }

  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }
   // POST new event (admin only)
   postEvent$(event: CountriesModel): Observable<CountriesModel> {
    return this.http
      .post(`${ENV.BASE_API}countries`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  // POST new event (admin only)
  filterCountries$(filterInput,endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  deleteCountryById$(id:number):Observable<number>{
    return this.http
    .delete(`${ENV.BASE_API}countries/${id}`, {
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
  // PUT existing event (admin only)
  editEvent$(id: number, event: CountriesModel): Observable<CountriesModel> {    
    return this.http
      .put(`${ENV.BASE_API}countries/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  // POST new event (admin only)
  getCountries$() {
    return this.http
      .get(`${ENV.BASE_API}countries`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  // GET list of public, future events
  //getCountryById$(id: number): Observable<CountriesModel> {
    getCountryById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}countries/${id}`, {
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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ENV } from '../env.config';
import { ProductModel } from '../models/product.model';

@Injectable()
export class CompanyService {
  private currentUser : any;
  constructor(private http: HttpClient,private router: Router) { }

  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser){
      return this.currentUser.token;
    }
    return 'revere';
  }


  getcompanies$() {
    return this.http
      .get(`${ENV.BASE_API}companies`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET list of public, future events
    getCompanyById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}company/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  getCompanyByName$(name: any) {
    return this.http
      .get(`${ENV.BASE_API}companyByName/${name}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  
  // POST new event (admin only)
    postEvent$(event) {
    return this.http
      .post(`${ENV.BASE_API}company`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }


 // POST new event (admin only)
 filterCompanies$(filterInput,endPoint) {
  return this.http
    .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
}
  editEvent$(id, event) {    
    return this.http
      .put(`${ENV.BASE_API}company/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Delete Ticker
  deleteCompanyById$(id: number): Observable<number>{
    return this.http
      .delete(`${ENV.BASE_API}company/${id}`, {
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

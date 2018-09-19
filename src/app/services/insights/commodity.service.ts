import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../../env.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { CommoditiesModel } from '../../admin/admin-insights/commodities-form/commodities-form.component';

@Injectable()
export class CommodityService {
  private currentUser : any;

  constructor(private http: HttpClient,private router: Router) {   }

  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser){
      return this.currentUser.token;
    }else{
      return 'revere';
    }
  }

  getCommodities(){
    return this.http.get(`${ENV.BASE_API}commodity-types`, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
  getCommoditiesById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}commodities/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  filterCommodities$(filterInput,endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
    editEvent$(id: number, event: CommoditiesModel): Observable<CommoditiesModel> {    
      return this.http
        .put(`${ENV.BASE_API}commodities/${id}`, event, {
          headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .catch(this._handleError);
    }
  postEvent$(SubmitingRecord){
    return this.http
      .post(`${ENV.BASE_API}commodities`, SubmitingRecord, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  deleteCommodityById$(id:number):Observable<number>{
    return this.http
    .delete(`${ENV.BASE_API}commodity/${id}`, {
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

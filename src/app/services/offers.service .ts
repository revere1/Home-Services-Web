import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { OfferModel } from '../models/offer.model';

@Injectable()
export class OffersService {

  private currentUser : any;

  constructor(private http: HttpClient,private router: Router) { }

  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }
  

  public getToken(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }
  getUserById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}offers/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  // POST new event (admin only)
  getOffers$() {
    return this.http
      .get(`${ENV.BASE_API}offers`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }


  removeFile(file){
    return this.http
      .delete(`${ENV.BASE_API}offers/remove-file`, {
        headers: new HttpHeaders()
                  .set('Authorization', this._authHeader)
                  .set('file', file)
      })
      .catch(this._handleError);
  }


  // POST new event (admin only)
  filterOffers$(filterInput,endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  deleteOfferById$(id:number):Observable<number>{
    return this.http
    .delete(`${ENV.BASE_API}offers/${id}`, {
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
   // POST new event (admin only)
   postEvent$(event: OfferModel): Observable<OfferModel> {
    return this.http
      .post(`${ENV.BASE_API}offers`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing event (admin only)
  editEvent$(id: number, event: OfferModel): Observable<OfferModel> {    
    return this.http
      .put(`${ENV.BASE_API}offers/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  // POST new event (admin only)
  //getSectorById$(id: number): Observable<SectorModel> {
    getOffersId$(id: number){
    return this.http
      .get(`${ENV.BASE_API}offers/${id}`, {
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

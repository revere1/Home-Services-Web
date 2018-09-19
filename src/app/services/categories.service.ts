import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ENV } from '../env.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { CategoriesModel } from '../models/categories.model';

@Injectable()
export class CategoriesService {

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

  // POST new event (admin only)
  getCategory$() {
    return this.http
      .get(`${ENV.BASE_API}categories`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }


  removeFile(file){
    return this.http
      .delete(`${ENV.BASE_API}categories/remove-file`, {
        headers: new HttpHeaders()
                  .set('Authorization', this._authHeader)
                  .set('file', file)
      })
      .catch(this._handleError);
  }


  // POST new event (admin only)
  filterCategories$(filterInput,endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  deleteCategoryById$(id:number):Observable<number>{
    return this.http
    .delete(`${ENV.BASE_API}categories/${id}`, {
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
   // POST new event (admin only)
   postEvent$(event: CategoriesModel): Observable<CategoriesModel> {
    return this.http
      .post(`${ENV.BASE_API}categories`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing event (admin only)
  editEvent$(id: number, event: CategoriesModel): Observable<CategoriesModel> {    
    return this.http
      .put(`${ENV.BASE_API}categories/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  // POST new event (admin only)
  //getSectorById$(id: number): Observable<SectorModel> {
    getSectorById$(id: number){
    return this.http
      .get(`${ENV.BASE_API}categories/${id}`, {
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

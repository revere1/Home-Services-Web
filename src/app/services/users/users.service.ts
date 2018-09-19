import { Injectable } from '@angular/core';
import { ENV } from '../../env.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersModel, UsersUpdateModel } from '../../models/users.model';
@Injectable()
export class UsersService {

  private currentUser : any;
  constructor(private http: HttpClient,private router: Router) { }

  public getToken(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }
  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.token;
  }

  // POST new event (admin only)
  postEvent$(event: UsersModel): Observable<UsersModel> {
    return this.http
      .post(`${ENV.BASE_API}user`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

   // PUT existing event (admin only)
   editEvent$(id: number, event: UsersUpdateModel): Observable<UsersUpdateModel> {    
    return this.http
      .put(`${ENV.BASE_API}user/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  removeFile(file){
    return this.http
      .delete(`${ENV.BASE_API}lockers/remove-file`, {
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
}

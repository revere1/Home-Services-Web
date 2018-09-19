import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ENV } from '../env.config';
import { LockerModel } from '../models/locker.model';
@Injectable()
export class LockersService {
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
  postEvent$(event: LockerModel): Observable<LockerModel> {
    return this.http
      .post(`${ENV.BASE_API}lockers`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  getLockerById$(id: number): Observable<LockerModel> {
    return this.http
      .get(`${ENV.BASE_API}lockers/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

 // POST new event (admin only)
 filterLockers$(filterInput,endPoint) {
  return this.http
    .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
}

    // GET list of public, future events

    getUser$(id: number) {
      return this.http
        .get(`${ENV.BASE_API}usersalllocker/${id}`, {
          headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .catch(this._handleError);
    }
    

 // PUT existing event (admin only)
 editEvent$(id: number, event: LockerModel): Observable<LockerModel> {    
  return this.http
    .put(`${ENV.BASE_API}lockers/${id}`, event, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
}



  getCurUserId(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.user.userid;    
  }
  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.router.navigate(['/auth/login']);
    }
    return Observable.throw(errorMsg);
  }


  lockersCount$(id: number) {
    return this.http
      .post(`${ENV.BASE_API}fetch-lockercounts/${id}`, {}, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // upload(formData) {
  //   let headers = new HttpHeaders();
  //   headers.set('Authorization', this._authHeader);
  //   headers.set('Content-Type', 'application/json');
  //   let options = {
  //     headers: headers
  //   };

  //   return this.http
  //   .post(`${ENV.BASE_API}lockers/path`, formData)
  //   .catch(this._handleError);
  // }


  removeFile(file){
    return this.http
      .delete(`${ENV.BASE_API}lockers/remove-file`, {
        headers: new HttpHeaders()
                  .set('Authorization', this._authHeader)
                  .set('file', file)
      })
      .catch(this._handleError);
  }

  getLockerTypes(){
    return this.http.get(`${ENV.BASE_API}locker-types`, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
}

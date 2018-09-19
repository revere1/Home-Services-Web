import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ENV } from '../env.config';
import { ClientModel } from '../models/client.model';
import { ContactUsModel } from '../models/contact_us.model';

@Injectable()
export class UserService {
  private currentUser : any;
  constructor(private http: HttpClient,private router: Router) {}

  private get _authHeader(): string {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser){
      return this.currentUser.token;
    }else{
      return 'revere';
    }
  }

 
  getUserById$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}user/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  

  // POST new event (admin only)
  postEvent$(event) {
    return this.http
      .post(`${ENV.BASE_API}user`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST new event (admin only)
  filterUsers$(filterInput,endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //Delete Ticker
  deleteUserById$(id: number): Observable<number>{
    return this.http
      .delete(`${ENV.BASE_API}user/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  getCurUserId(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.user.userid;    
  }

  
  // PUT existing event (admin only)
  editEvent$(id: number, event) {  
    return this.http
      .put(`${ENV.BASE_API}user/${id}`, event, {
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

  getUserDetails(id:number){
    return this.http.get(`${ENV.BASE_API}user-details/${id}`,
      { headers: new HttpHeaders().set('Authorization', this._authHeader)}
      ).catch(this._handleError);
  }

  getAvatar(){
    //this.getCurUserId
  }
  getUserList(val){
    return this.http
    .post(`${ENV.BASE_API}adminlist`,{'acceslevel':val},{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
  upload(formData) {

    return this.http
    .post(`${ENV.BASE_API}user/profile-pic`, formData,{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }

  uploads(formData) {

    return this.http
    .post(`${ENV.BASE_API}user/about-files`, formData,{
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }


  globalSearch(term){
    
    return this.http
      .get(`${ENV.BASE_API}search?term=`+term, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  
  ContactusPostEvent$(event:ContactUsModel){
    return this.http
    .post(`${ENV.BASE_API}contact-us`, event, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
    .catch(this._handleError);
  }
  
}

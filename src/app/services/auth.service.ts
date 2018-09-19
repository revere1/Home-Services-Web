import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { ENV } from '../env.config';

import { IUser } from './user';

@Injectable()
export class AuthService {

  public currentUser: IUser;

  constructor(public http: HttpClient, private router: Router) { }

  isLoggedIn(url,role): boolean {
    
    try {
        const theUser:any = JSON.parse(localStorage.getItem('currentUser'));
      
        
        if (theUser && theUser.token){

          this.tokenCheck(theUser.token).subscribe(data => {
            if (data.success === false) {
         
              this.router.navigate(['/auth/login']);
             
            } else {
             
              if (theUser && (theUser.user.access_level === data.data.access_level)) {
               
                this.currentUser = theUser.user;
               
               if(role === data.data.access_level && (data.data.status === 'active'))
               this.router.navigate([url]);
               //else if(data.data.access_level === 1)this.router.navigate(['/admin']);
               else if(data.data.access_level === 1){
                let url = (data.data.status === 'active') ? ['/admin'] : ['/auth/updateprofile'];
                this.router.navigate(url);              
              } 
               else if(data.data.access_level === 2){
                let url = (data.data.status === 'active') ? ['/client'] : ['/auth/updateprofile'];
                this.router.navigate(url);              
              } 
              else if(data.data.access_level === 3){
                let url = (data.data.status === 'active') ? ['/analyst'] : ['/auth/updateprofile'];
                this.router.navigate(url);              
              } 
              else if(data.data.access_level === 4){
                let url = (data.data.status === 'active') ? ['/editorier'] : ['/auth/updateprofile'];
                this.router.navigate(url);              
              } 
                //else if(data.data.access_level === 3)this.router.navigate(['/analyst']);
                //else if(data.data.access_level === 4)this.router.navigate(['/editorier']);
                else this.router.navigate(['/auth/login']);
              }              
            }            
          });
        }
        
        if (theUser && (theUser.user.access_level === role)) {
            this.currentUser = theUser.user;
        }
    } catch (e) {
        return false;
    }
    
    return !!this.currentUser;
  }

  tokenCheck(token){
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${ENV.BASE_API}checkuserlevel`, JSON.stringify({token:token}), {headers:headers})
    .do((response: Response) => {      
        response;
    })
    .catch(this.handleError);
  }

  login(oUser) {
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    /*let options = {
      params: new HttpParams()
    };
    options.params.set("foo","bar");*/
    return this.http.post(`${ENV.BASE_API}login`, JSON.stringify(oUser), {headers:headers})
    .do((response : any) => {
        
        if (response.success) {
            this.currentUser = <IUser>response.data;
            let userObj: any = {};
            userObj.user = response.data;
            userObj.token = response.token;
            localStorage.setItem('currentUser', JSON.stringify(userObj));
        }
        response;
    })
    .catch(this.handleError);
  }

  forgotPassword(oUser) {  
    let headers = new HttpHeaders().set('Content-Type', 'application/json');    
    return this.http.post(`${ENV.BASE_API}forgot-password`, JSON.stringify(oUser), {headers:headers})
    .do((response: Response) => {        
        response;
    })
    .catch(this.handleError);
  }

  resetPassword(oUser) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');    
    return this.http.post(`${ENV.BASE_API}reset-password`, JSON.stringify(oUser), {headers:headers})
    .do((response: Response) => {        
        response;
    })
    .catch(this.handleError);
  }

  changePassword(oUser) {  
    let headers = new HttpHeaders().set('Content-Type', 'application/json');    
    return this.http.post(`${ENV.BASE_API}change-password`, JSON.stringify(oUser), {headers:headers})
    .do((response: Response) => {        
        response;
    })
    .catch(this.handleError);
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  private handleError(error: Response) {
    
    return Observable.throw(error.json() || 'Server error');
  }

  loadSession(){
     let theUser = JSON.parse(localStorage.getItem('currentUser'));
      if (theUser && theUser.token){
        this.currentUser = theUser.user;
      }
  }

  fullname(): string{    
    return this.currentUser.first_name+' '+this.currentUser.last_name; 
  }

}

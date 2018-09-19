import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { ENV } from '../env.config';
import { MessagesModel } from '../models/messages.model';
import { AdminMessageModel } from '../models/admin-message.module';
import { Subscription, Subject } from 'rxjs';
interface Message {
  type: string;
  payload: any;
}

type MessageCallback = (payload: any) => void;

@Injectable()
export class MessagesService {
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
  postEvent$(event: MessagesModel): Observable<MessagesModel> {
    return this.http
      .post(`${ENV.BASE_API}messages`, event, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }



  private handler = new Subject<Message>();

  broadcast(type: string, payload: any) {
    this.handler.next({ type, payload });
  }

  subscribe(type: string, callback: MessageCallback): Subscription {
    return this.handler
      .filter(message => message.type === type)
      .map(message => message.payload)
      .subscribe(callback);
  }
 
   postEventForReply$(id: number, event: AdminMessageModel) {    
    return this.http
      .post(`${ENV.BASE_API}reply/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
    removeFile(file){
      return this.http
        .delete(`${ENV.BASE_API}messages/remove-file`, {
          headers: new HttpHeaders()
                    .set('Authorization', this._authHeader)
                    .set('file', file)
        })
        .catch(this._handleError);
    }
  
  getCurUserId(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.user.userid;    
  }
  messagesCount$(id: number) {
    return this.http
      .post(`${ENV.BASE_API}fetch-counts/${id}`, {}, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  updateIsRead$(id: number) {
    return this.http
      .post(`${ENV.BASE_API}update-isRead/${id}`, {}, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  MessagesUserList$(id: number) {
    return this.http
      .get(`${ENV.BASE_API}messageUser-list/${id}`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  //messageById$(id: number): Observable<MessagesModel> {
  //   messageById$(id: number) {
  //     return this.http
  //     .post(`${ENV.BASE_API}message/${id}`,{
  //       headers: new HttpHeaders().set('authorization', this._authHeader)
  //     })
  //     .catch(this._handleError);
  // }
  messageById$(id: number) {
    return this.http
    .post(`${ENV.BASE_API}message/${id}`, { userId:this.getCurUserId() }, {
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
}
  latestMessageById$(id: number) {
    return this.http
    .post(`${ENV.BASE_API}latestmessage/${id}`, { userId:this.getCurUserId() }, {
      headers: new HttpHeaders().set('authorization', this._authHeader)
    })
    .catch(this._handleError);
}
  filterMessages$(filterInput,endPoint) {
    return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  messageReplyById$(id: number): Observable<MessagesModel> {
    return this.http
      .get(`${ENV.BASE_API}messagereply/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  //upload summer note images 
  
  uploads(formData) {
    return this.http
    .post(`${ENV.BASE_API}messages/summernote-img`, formData,{
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


import { HttpClient, HttpHeaders, HttpErrorResponse } from "../../../node_modules/@angular/common/http";
import { ENV } from "../env.config";
import { Observable } from "../../../node_modules/rxjs";
import { Router } from "../../../node_modules/@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class BannersService {

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
    
    public getAllActiveProducts(){
        return this.http.get(`${ENV.BASE_API}get-all-aprods`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      }).catch(this._handleError);
    }

    public getAllActiveCats(){
        return this.http.get(`${ENV.BASE_API}get-all-acats`, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
      }).catch(this._handleError);
    }

    public saveBanner(data:any){
      return this.http.post(`${ENV.BASE_API}add-banner`,JSON.stringify(data),{
        headers:new HttpHeaders().append('Content-Type', 'application/json').set('authorization',this._authHeader)}).catch(this._handleError);
    }

    public filterBanners$(filterInput,endPoint){
      return this.http
      .post(`${ENV.BASE_API}${endPoint}`, filterInput, {
        headers: new HttpHeaders().set('authorization', this._authHeader)
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
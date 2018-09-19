import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class BaseService {
    constructor(private http: HttpClient) { }

    getData(dataUrl='/assets/sidebar-menu.json'): Promise<any[]> {        
        return this.http
            .get(dataUrl, {}).toPromise()
            .then(response => {
                return response;
            })
            .catch(this.handleError);       
    }
    getRegions(dataUrl='/assets/regions.json'): Promise<any[]> {        
        return this.http
            .get(dataUrl, {}).toPromise()
            .then(response => {
                return response;
            })
            .catch(this.handleError);       
    }
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}
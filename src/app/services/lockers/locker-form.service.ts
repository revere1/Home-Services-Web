import { Injectable } from '@angular/core';

@Injectable()
export class LockerFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    title: '',
    files:[],
    note:'',
    url:''
  };
 

  constructor() {
    this.validationMessages = {
      title: {
        required: `Title is <strong>required</strong>.`
       },
       files: {
        required: `Please <strong>Upload</strong> File(s).`
       },
       note:{
          required: `Note is <strong>required</strong>.`
       },
       url:{
          required: `URL is <strong>required</strong>.`
       }      
    };
  }

}

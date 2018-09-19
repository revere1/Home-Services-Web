

import { Injectable } from '@angular/core';

@Injectable()
export class CompanyFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    name: '',
    company: '',  
    website:'',
    about:''
 
  };
 

  constructor() {
    this.validationMessages = {
      name: {
        required: `Name is <strong>required</strong>.`
      },
      company: {
        required: `Company is <strong>required</strong>.`
      },      
      website:{
        required: `Webiste is <strong>required</strong>.`
      },
      about:{
        required: `About is <strong>required</strong>.`,
      },
  
    };
  }

}

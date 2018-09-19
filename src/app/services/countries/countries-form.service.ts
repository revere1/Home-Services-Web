import { Injectable } from '@angular/core';

@Injectable()
export class CountriesFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    name: '',
    status: '',
    createdBy:'',
    updatedBy:'',
 
  };
 

  constructor() {
    this.validationMessages = {
      name: {
        required: `Country  Name is <strong>required</strong>.`
      },
      status: {
        required: `Status is <strong>required</strong>.`
      },      
    };
  }

}

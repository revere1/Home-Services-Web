import { Injectable } from '@angular/core';

@Injectable()
export class CategoryFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    category_name: '',
    category_desc:'',
    status: '',
   
 
  };
 

  constructor() {
    this.validationMessages = {
      category_name: {
        required: `Category Name is <strong>required</strong>.`
      },
      category_desc: {
        required: `Category Description is <strong>required</strong>.`
      },
      status: {
        required: `Category is <strong>required</strong>.`
      },      
     
    };
  }

}

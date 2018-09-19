import { Injectable } from '@angular/core';

@Injectable()

export class InsightcommentFormService {

    validationMessages: any;
    // Set up errors object
    formErrors = {
      comment: '',    
      files: '',  
   
    };
   
  
    constructor() {
      this.validationMessages = {
        comment: {
          required: `comment is <strong>required</strong>.`
        },            
        files: {         
          exceeded: `You already <strong>exceeded</strong> the limit of files upload.`,
        },
      };
    }
  
  }


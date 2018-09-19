import { Injectable } from '@angular/core';

@Injectable()


export class ContactUsFormService {

    validationMessages: any;
    // Set up errors object
    formErrors = {
      name: '',
      mobile:'',
      email: '',
      comments:''
    };

    constructor() {
      this.validationMessages = {
        name: {
          required: `Name is<strong>required</strong>.`
        },
        mobile:{
          minlength:'Contact Number should be 10digit',
          required: `Contact Number  is <strong>required</strong>.`,
          pattern:'Contact Number should be only number',
        },      
        email: {
          required: `Email is <strong>required</strong>.`,
          email:`Email must be <strong>Formatted</strong> Correctly`
        }, 
        comments:{
          required: `comments is <strong>required</strong>`
        }     
      };
    }
  
  }


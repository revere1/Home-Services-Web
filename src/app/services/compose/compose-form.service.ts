import { Injectable } from '@angular/core';

@Injectable()


export class ComposeFormService {

    validationMessages: any;
    // Set up errors object
    formErrors = {
      headline: '',
      summary:'',
      description: '',
      files: '',
      createdBy:'',
      updatedBy:'',
   
    };
   
  
    constructor() {
      this.validationMessages = {
        headline: {
          required: `Compose headline is <strong>required</strong>.`
        },
        summary:{
          required: `summary is <strong>minimum 200 </strong>characters.`
        },      

        description: {
          required: `descrption is <strong>minimum 500 </strong>characters.`
        },      
        files: {         
          exceeded: `You already <strong>exceeded</strong> the limit of files upload.`,
        },
      };
    }
  
  }


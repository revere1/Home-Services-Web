import { Injectable } from '@angular/core';

@Injectable()


export class HelpFormService {

    validationMessages: any;
    // Set up errors object
    formErrors = {
      subject: '',
      description: '',
      files: '',
      createdBy:'',
      updatedBy:'',
   
    };
   
  
    constructor() {
      this.validationMessages = {
        subject: {
          required: `Subject is <strong>required</strong>.`
        },
        description: {
          required: `Descrption is <strong>Minimum 20 </strong> Characters.`
        },      
        files: {         
          exceeded: `You already <strong>exceeded</strong> the limit of files upload.`,
        },
      };
    }
  
  }


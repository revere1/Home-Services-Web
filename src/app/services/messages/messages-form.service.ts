import { Injectable } from '@angular/core';

@Injectable()
export class MessagesFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    sent_to:'',
    subject:'',
    message: '',
    files: '',
  };
 

  constructor() {
    this.validationMessages = {
      sent_to: {
        required: `To  mail  is <strong>required</strong>.`
      },
      subject: {
        required: `Subject is <strong>required</strong>.`
      },
        message: {
        required: `Message is <strong>required</strong>.`
      },
      files: {         
        exceeded: `You already <strong>exceeded</strong> the limit of files upload.`,
      }
    };
  }

}

import { Injectable } from '@angular/core';

@Injectable()
export class UserFormService {

  validationMessages: any;
  formErrors = {
    user_name: '',
    user_mail:'',
    user_mobile:'',
    status: ''
  };
 

  constructor() {
    this.validationMessages = {
      user_name: {
        required: `User Name is <strong>required</strong>.`
      },
      user_mail: {
        required: `User mail is <strong>required</strong>.`
      },
      user_mobile: {
        required: `User mobile is <strong>required</strong>.`
      },
      status: {
        required: `Select user <strong>status</strong>.`
      },      
     
    };
  }
}

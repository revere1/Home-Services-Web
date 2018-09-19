import { Injectable } from '@angular/core';

@Injectable()
export class ClientFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    password:'',
    confirm_password:'',
    company_url:'',
    company_name:'',
    sector_id:'',
    subsector_id:'',
    country_id:'',
    state_id:'',
    city:'',
    zip_code:'',
    profile_pic:'',
    about:''
   
  };
 

  constructor() {
    this.validationMessages = {
      first_name: {
        required: `First Name is <strong>required</strong>.`
      },
      last_name: {
        required: `Last Name is <strong>required</strong>.`
      },      
      email: {
        required: `Email is <strong>required</strong>.`,
        email:`Email must be <strong>Formatted</strong> Correctly`
      },
      contact_number: {
    
        minlength:'Contact Number should be 10digit',
        pattern:'Contact Number should be only number',
        required: `Contact Number is <strong>required</strong>.`
        },      
        company_url: {
          required: `Company_url is <strong>required</strong>.`,
          company_url:`Enter <strong>Valid</strong> Company_url`
        },
        company_name: {
          required: `Company_name is <strong>required</strong>.`,
          company_name:`Enter <strong>Valid</strong> Company_name`
        },
        password:{
          required: `Password is <strong>required</strong>.`,
        },

        confirm_password:{
          required: `Confirm Password is <strong>required</strong>.`,
          notSame:  `Passwords not matched`
        },
        sector_id: {
          required: `Sector is <strong>required</strong>.`,
          sector_id:`Select <strong>Valid</strong> Sector`
        },
        subsector_id: {
          required: `Subsector is <strong>required</strong>.`,
          subsector_id:`Select <strong>Valid</strong> Subsector`
        },
        country_id: {
          required: `Country is <strong>required</strong>.`,
          country_id:`Select <strong>Valid</strong> Email`
        },
        state_id: {
          required: `State is <strong>required</strong>.`,
          state_id:`Select <strong>Valid</strong> State`
        },
        city: {
          required: `City is <strong>required</strong>.`,
          city:`Enter <strong>Valid</strong> City`
        },
      zip_code: {
       required: `Zip_code is <strong>required</strong>.`,
       pattern:'zip_code should be only number',
      },
      profile_pic:
      {
        required: `Profile_pic is <strong>required</strong>.`,
        pattern:' please upload Profile_pic',
       },
       about:{
        required: `About is <strong>required</strong>.`,
      },
    };
  }

}

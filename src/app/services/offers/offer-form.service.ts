import { Injectable } from '@angular/core';

@Injectable()
export class OfferFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    offer_name: '',
    offer_code:'',
    offer_description:'',
    discount_type:'',
    discount_value:'',
    limit:'',
    limit_value:'',
    status: '',
   
 
  };
 

  constructor() {
    this.validationMessages = {
      offer_name: {
        required: `offer Name is <strong>required</strong>.`
      },
      offer_code: {
        required: `offer Name is <strong>required</strong>.`
      },
      offer_description: {
        required: `offer Description is <strong>required</strong>.`
      },
      discount_type:{
        required: `discount_type is <strong>required</strong>.`
      },
      discount_value:{
        required: `discount_value is <strong>required</strong>.`,
        pattern:'Only Numbers Allowed'
      },
      limit:{
        required: `limit is <strong>required</strong>.`,
        pattern:'Only Numbers Allowed'
      },
      limit_value:{
        required: `limit_value is <strong>required</strong>.`,
        pattern:'Only Numbers Allowed'
      },

      status: {
        required: `status  is <strong>required</strong>.`
      },      
     
    };
  }

}

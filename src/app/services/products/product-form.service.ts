

import { Injectable } from '@angular/core';

@Injectable()
export class ProductFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    product_name: '',
    product_code: '',
    category: '',
    subcategory:'',
    cost:'',
    delivery_days:'',
    quatity:'',
    files:'',
    description:''
  };
 

  constructor() {
    this.validationMessages = {
      product_name: {
        required: `Product_name is <strong>required</strong>.`
      },
      product_code: {
        required: `Product_code is <strong>required</strong>.`
      },
      category: {
        required: `Category is <strong>required</strong>.`
      },      
   
      subcategory:{
        required: `Sub-category is <strong>required</strong>.`
        
      },
      cost:{
        required: `price is <strong>required</strong>.`,
        pattern:'Only Numbers Allowed'
      },
      delivery_days:{
        required: `product delivery days is <strong>required</strong>.`,
        pattern:'Only Numbers Allowed'
      },
      quatity:{
        required: `quatity is <strong>required</strong>.`,
        pattern:'Only Numbers Allowed'
      },
      files: {         
        exceeded: `You already <strong>exceeded</strong> the limit of files upload.`,
      },
      description:{
       required :`product description is <strong>required</strong>`
      }
    };
  }

}

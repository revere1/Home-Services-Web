import { Injectable } from '@angular/core';

@Injectable()
export class MacroTypeFormService {

  validationMessages: any;
  // Set up errors object
  formErrors = {
    macro_type:'',
    sectorId:'',
    subsectorId: '',
    region: '',
    currency:''
  };
 

  constructor() {
    this.validationMessages = {
        macro_type: {
        required: ` macro_type  is <strong>required</strong>.`
      },
      sectorId: {
        required: `sectoId is <strong>required</strong>.`
      },
      subsectorId: {
        required: `subsectoId is <strong>required</strong>.`
      },
      region: {         
        required: `region is <strong>required</strong>.`
      },
      currency: {         
        required: `currency is <strong>required</strong>.`
      },
    };
  }

}
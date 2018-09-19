import { Injectable } from '@angular/core';

@Injectable()
export class StatesFormService {
    validationMessages : any;
    //set up errors object
    formErrors = {
        name : '',
        country : '',
        status : '',
        createdBy:'',
        updatedBy:'',
    };
    constructor(){
        this.validationMessages ={
            name: {
                required: `State  Name is <strong>required</strong>.`
              },
              country : {
                required : `Country   is <strong>required</strong>`
              },
              status: {
                required: `Status is <strong>required</strong>.`
              },
        };
    }
}
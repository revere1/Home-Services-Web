import { Injectable } from '@angular/core';

@Injectable()
export class SubCategoryFormService {
    validationMessages : any;
    //set up errors object
    formErrors = {
        name : '',
        sector : '',
        status : ''
    };
    constructor(){
        this.validationMessages ={
            name: {
                required: `SubSector  Name is <strong>required</strong>.`
              },
              sector : {
                required : `Sector   is <strong>required</strong>`
              },
              status: {
                required: `Status is <strong>required</strong>.`
              },
        };
    }
}
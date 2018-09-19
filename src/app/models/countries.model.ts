class CountriesModel {
    constructor(
      public name: string,
      public status: string,
      public createdBy: string,
      public updatedBy:string,
      public id?: number

    ) { }
  }
  
  class FormCountriesModel {
    constructor(
        public name: string,
        public status: string,
        public createdBy: string,
        public updatedBy:string
    ) { }
  }
  
  export { CountriesModel, FormCountriesModel };
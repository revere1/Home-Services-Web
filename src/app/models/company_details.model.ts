class CompanyModel {
    constructor(
      public name: string,    
      public website: string,
      public about: string,   
      public createdBy:string,
      public updatedBy:string,
      public id?: number
      
    ) { }
  }
  
  class FormCompanyModel {
    constructor(
        public name: string,       
        public website: string,
        public about : string,
        public createdBy:string,
        public updatedBy:string,
       
     
    
    ) { }
  }
  
  export { CompanyModel, FormCompanyModel };
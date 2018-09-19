class ContactUsModel {
    constructor(
      public name :string,
      public mobile: number,
      public email: string,
      public comments:string,
      public id?: number,
    ) { }
  }
  
  class FormContactUsModel {
    constructor(
        public name :string,
        public mobile: number,
        public email: string,
        public comments:string,
        public id?: number,
    ) { }
  }
  
  export {ContactUsModel, FormContactUsModel };
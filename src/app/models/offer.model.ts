class OfferModel {
    constructor(
      public offer_name: string,
      public offer_code: string,
      public desc:string,
      public discount_type:string,
      public discount_value :string,
      public limit: string,
      public limit_value: string,
      public offer_img,
      public status:string,
      public id?: number
      
    ) { }
  }
  
  class FormOfferModel {
    constructor(
        public offer_name: string,
        public offer_code: string,
        public desc: string,
        public discount_type:string, 
        public discount_value :string,     
        public limit: string,
        public limit_value: string,
        public offer_img,
        public status:string,
       
    ) { }
  }
  
  export { OfferModel, FormOfferModel };
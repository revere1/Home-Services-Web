class ProductModel {
    constructor(
      public product_name: string,
      public product_code: string,
      public category_id : number,
      public subcategory_id: number,       
      public product_description: string,
      //public path,
    
      public cost: string,
      public offer_price: string,
      public delivery_days:number,
      public quantity: number,
      public status:number,
      public files = [],
      public id?: number
      
    ) { }
  }
  
  class FormProductModel {
    constructor(
        public product_name: string,
        public product_code: string,
        public category_id : number,
        public subcategory_id: number,       
        public product_description: string,
        //public path,
        public cost: string,
        public offer_price: string,
        public delivery_days:number,
        public quantity: number,
        public status:number,
        public files = [],
    ) { }
  }
  
  export { ProductModel, FormProductModel };
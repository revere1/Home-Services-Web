class AdminMessageModel {
    constructor(
      public message: string,
      public parent: number,
      public is_read:number,
      public sent_to:number,
      public sent_from:number,
      public id?: number
    ) { }
  }
  
  class  AdminMessageFormModel {
    constructor(
        public message: string,
        public parent: number,
        public is_read:number,
        public sent_to:number,
        public sent_from:number,
    ) { }
  }
  
  export {AdminMessageModel, AdminMessageFormModel};
class MessagesModel {
    constructor(
      public sent_to = [],
      public subject : string,
      public message: string,
      public sent_from: number,
      public parent?: number,
      public files = [],
      public id?: number
    ) { }
  }
  
  class MessagesFormModel {
    constructor(
      public sent_to = [],
      public subject : string,
        public message: string,
        public sent_from: number,
        public parent?: number,
        public files = [],
     
    ) { }
  }
  
  export { MessagesModel, MessagesFormModel };
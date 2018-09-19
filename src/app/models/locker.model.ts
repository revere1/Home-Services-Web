class LockerModel {
    constructor(
      public title: string,
      public note: string,
      public url: string,
      public typeId:string,
      public createdBy: string,
      public updatedBy: string,
      public files = [],
      public id?: number 
    ) { }
  }
  
  
  class FormLockerModel {
    constructor(
      public title: string,
      public note: string,
      public url: string,
      public typeId: string, 
      public files = []
    ) { }
  }
  
  export { LockerModel, FormLockerModel };
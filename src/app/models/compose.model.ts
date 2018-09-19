class ComposeModel {
    constructor(
      public headline :string,
      public summary: string,
      public bullbear: string,
      public description: string,
      public createdBy: number,
      public updatedBy: number,
      public status?: string,
      public files = [],
      public id?: number, 
      public type? : string, 
    ) { }
  }
  
  class FormComposeModel {
    constructor(
      public headline :string,
      public summary: string,
      public bullbear: string,
      public description: string,
      public createdBy: number,
      public updatedBy: number,
      public files = []
    ) { }
  }
  
  export {ComposeModel, FormComposeModel };
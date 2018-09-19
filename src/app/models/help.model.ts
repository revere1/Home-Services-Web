class HelpModel {
    constructor(
      public subject: string,
      public description: string,
      public createdBy: number,
      public updatedBy: number,
      public resolvedBy: number,
      public status?: string,
      public files = [],
      public id?: number,  
    ) { }
  }
  
  class FormHelpModel {
    constructor(
      public subject: string,
      public description: string,
      public createdBy: number,
      public updatedBy: number,
      public resolvedBy: number,
      public files = []
    ) { }
  }
  
  export {HelpModel, FormHelpModel };
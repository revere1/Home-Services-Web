class HelpCommentModel {
    constructor(
      public message: string,
      public status: string,
      public parentId: number,
      public is_read:number,
      public problemId: number,
      public msgTo: number,
      public createdBy: number,
      public resolvedBy: string,
      public resolved_date:DateTimeFormat,
      public id?: number, 
    ) { }
  }
  
  class FormHelpCommentModel {
    constructor(
      public message: string,
      public status: string,
      public parentId: number,
      public is_read:number,
      public problemId: number,
      public msgTo: number,
      public createdBy: number,
      public resolvedBy: string,
      public resolved_date:DateTimeFormat,
    
    
    ) { }
  }
  
  export {HelpCommentModel, FormHelpCommentModel};
class InsightCommentModel {
    constructor(
      public comment: string,
      public parent: number,
      public is_read:number,
      public insightId: number,
      public from: number,
      public files = [],
      public id?: number, 
    ) { }
  }
  
  class FormInsightCommentModel {
    constructor(
      public comment: string,
      public parent: number,
      public is_read:number,
      public insightId: number,
      public from: number,
      public files = [],
      

    ) { }
  }
  
  export {InsightCommentModel, FormInsightCommentModel};
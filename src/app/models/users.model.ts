class UsersModel {
    constructor(
      public user_name: string,
      public user_email: string,
      public password: string,
      public status:number,
      public id?: number,
    ) { }
  }

  class UsersUpdateModel {
    constructor(
      public user_name: string,
      public user_email: string,
      public status:number,
      public id?: number,
    ) { }
  }
  
  class FormUsersModel {
    constructor(
        public user_name: string,
        public user_email: string,
        public password: string,
        public status:number,
        public id?: number,
   
     
    ) { }
  }
  class FormUsersUpdateModel {
    constructor(
        public user_name: string,
        public user_email: string,
        public status:number,
        public id?: number,
   
     
    ) { }
  }
  export {UsersModel,UsersUpdateModel, FormUsersModel,FormUsersUpdateModel };
class SubCategoryModel {
    constructor(
        public category_id: number,
        public subcategory_name: string,
        public subcategory_desc:string,
        public path,
        public status: string,
        public id?: number
    ) {}
}
class SubCategoryFormModel {
    constructor(
        public category_id : number,
        public subcategory_name : string,
        public subcategory_desc:string,
        public path,
        public status : string,
       
    ){}
}

export { SubCategoryModel,SubCategoryFormModel}
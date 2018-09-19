class StatesModel {
    constructor(
        public country_id: number,
        public name: string,
        public status: string,
        public createdBy: string,
        public updatedBy:string,
        public id?: number
    ) {}
}
class StatesFormModel {
    constructor(
        public country_id : number,
        public name : string,
        public status : string,
        public createdBy: string,
        public updatedBy:string,
    ){}
}

export { StatesModel,StatesFormModel}
class ClientModel {
  constructor(
    public first_name: string,
    public last_name: string,
    public email: string,
    public contact_number: string,
    public password: string,
    public confirm_password: string,
    public company_url: string,
    public company_name: string,
    public company_id:number,
    public sector_id: number,
    public subsector_id: number,
    public country_id: number,
    public state_id: number,
    public city: string,
    public zip_code: string,
    public access_level: string,
    public createdBy: string,
    public updatedBy: string,
    public status?: string,
    public id?: number,
    public about? : string,
    public profile_pic? :string,
  ) { }
}


class FormClientModel {
  constructor(
    public first_name: string,
    public last_name: string,
    public email: string,
    public contact_number: string,
    public password: string,
    public confirm_password: string,
    public company_url: string,
    public company_name: string,
    public company_id:number,
    public sector_id: number,
    public subsector_id: number,
    public country_id: number,
    public state_id: number,
    public city: string,
    public zip_code: string,
    public access_level: string,
    public about? : string,
    public profile_pic? :string,
   
  ) { }
}

export { ClientModel, FormClientModel };
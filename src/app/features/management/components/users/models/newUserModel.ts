export class NewUserModel {
  id?: string = ''
  name = ''
  last_name = ''
  user = ''
  email = ''
  phone_number?: string = ''
  password?: IRole
  role: any
  parking: any
  status?: number
  Admin?: string
  googleId?: string
  appleId?: string
  validate_code?: string = ''
  company?: string | null | any = ''
  otherParkings?: any[]
}

export class updateUserApp {
  id: string = ''
  name = ''
  last_name ? = ''
  email ? = ''
  phone_number?: string = ''
}

export interface getAdminsPaginatedModel {
  textToSearch: string,
  page: number,
  pageSize: number
}

export interface IRole {
  id: string,
  name: string
}

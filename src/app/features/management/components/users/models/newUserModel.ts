export class NewUserModel {
  id?: string = ''
  name = ''
  last_name = ''
  user = ''
  email = ''
  phone_number?: string = ''
  password?: string = ''
  role = ''
  parking: any
  status?: number
  Admin?: string
  googleId?: string
  appleId?: string
  validate_code?: string = ''
  company?: string | null= ''
}

export class updateUserApp {
  id: string = ''
  name = ''
  last_name ? = ''
  email ? = ''
  phone_number?: string = ''
}

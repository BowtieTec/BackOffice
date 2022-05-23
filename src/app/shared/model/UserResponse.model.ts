export class UserResponseModel {
  success = false
  message = ''
  data!: AuthModel
}

export class AuthModel {
  user!: UserModel
  token = ''
}

export class UserModel {
  id = ''
  name = ''
  last_name = ''
  email = ''
  parking!: ParkingAuthModel
  role!: RoleAuthModel
  user = ''
  status = 0
}

export class ParkingAuthModel {
  id = ''
  name = ''
  address = ''
  parking_spaces = ''
  special_parking_spaces = ''
  rules = ''
  status = 0
  nit: any
  business_address: any
  business_name: any
  minutes_to_exit = 0
  is_show_map = 0
  currency: any
  schedules: any
  pay_method: any
  is_our_bac_credential: any
  is_our_visa_credential: any
  url_logo: string = ''
  url_background: string = ''
  url_tariff: string = ''
}

export class RoleAuthModel {
  id = ''
  name = ''
  isSudo = false
}

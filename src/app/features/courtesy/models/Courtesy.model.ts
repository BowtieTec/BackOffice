export class CourtesyTypeModel {
  id = 0
  name = ''
}

export class CourtesyModel {
  id?: string = ''
  parkingId = ''
  quantity = 0
  value = 0
  type = 0
  name?: string = ''
  company?: CompanyModel = new CompanyModel()
  companyId?: string = ''
  condition? = 0
  cantHours? = 0
  valueTimeMinutes? = 0
  haveStation?: boolean = false
}

class CompanyModel {
  id = ''
  name = ''
}

export enum DiscountOnWhat {
  total = 1,
  cantHours = 2
}

export class tariffTestModel {
  parkingId = ''
  entry_date: Date = new Date()
  exit_date: Date = new Date()
  courtesyId? = ''
}

export interface IParamsCustomTariff {
  id: string
  name: string
  description: string
  event: string
  updated_at: string
}

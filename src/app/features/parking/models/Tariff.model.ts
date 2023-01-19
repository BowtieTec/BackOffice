import {Rules} from '../../shared/tariff/model/Tariff.model'

export class CreateTariffModel {
  static_description?: string = ''
  parking = ''
  name = ''
  description = ''
  isShowDescription = false
  rules: Rules[] = []
}

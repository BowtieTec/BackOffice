import { RuleModel } from './Tariff.model'

export class HolidayInputModel {
  static_descriptionTime = ''
  fromDate: Date = new Date()
  toDate: Date = new Date()
}

export class HolidayHourHalfInputModel extends HolidayInputModel {
  static_descriptionCost = ''
  costHour = 0
  costAHalf = 0
}

export class HolidayFixedCostInputModel extends HolidayInputModel {
  static_descriptionCost = ''
  fixedCost = 0
}

export class HolidayHourHalfRuleModel {
  static_description: string =
    this.holidayInput.static_descriptionTime +
    ' ' +
    this.holidayInput.static_descriptionCost
  rule: Array<RuleModel> = [
    {
      conditions: {
        all: [
          {
            fact: 'date_out',
            operator: 'dateIsGreaterThan',
            value: this.holidayInput.fromDate
          },
          {
            fact: 'date_out',
            operator: 'dateIsLessThan',
            value: this.holidayInput.toDate
          },
          {
            fact: 'hour',
            operator: 'greaterThanInclusive',
            value: 1
          }
        ]
      },
      event: {
        type: 'Tarifa por Hora y dia festivo',
        params: {
          value: this.holidayInput.costHour,
          path: 'hour'
        }
      }
    },
    {
      conditions: {
        all: [
          {
            fact: 'date_out',
            operator: 'dateIsGreaterThan',
            value: this.holidayInput.fromDate
          },
          {
            fact: 'date_out',
            operator: 'dateIsLessThan',
            value: this.holidayInput.toDate
          }
        ]
      },
      event: {
        type: 'Tarifa por Fracción y dia festivo',
        params: {
          value: this.holidayInput.costAHalf,
          path: 1
        }
      }
    }
  ]

  constructor(private holidayInput: HolidayHourHalfInputModel) {}
}

export class HolidayHourFixedCostModel {
  static_description: string =
    this.holidayInput.static_descriptionTime +
    ' ' +
    this.holidayInput.static_descriptionCost
  rule: Array<RuleModel> = [
    {
      conditions: {
        all: [
          {
            fact: 'date_out',
            operator: 'dateIsGreaterThan',
            value: this.holidayInput.fromDate
          },
          {
            fact: 'date_out',
            operator: 'dateIsLessThan',
            value: this.holidayInput.toDate
          },
          {
            any: [
              {
                fact: 'hour',
                operator: 'greaterThanInclusive',
                value: 1
              }
            ]
          }
        ]
      },
      event: {
        type: 'Dia festivo y costo fijo',
        params: {
          value: this.holidayInput.fixedCost,
          path: 1
        }
      }
    }
  ]

  constructor(private holidayInput: HolidayFixedCostInputModel) {}
}
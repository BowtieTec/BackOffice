import {Injectable} from '@angular/core'
import {HolidayInputModel} from '../model/HolidayTariff.model'
import {All, FixedCostInputModel, HourHalfInputModel, IEvent} from '../model/Tariff.model'
import {BlockInputModel} from '../model/BlockTariff.model'
import {RankInputModel} from '../model/RankTariff.model'
import {DailyInputModel} from "../model/DailyTariff.model";

@Injectable({
  providedIn: 'root'
})
export class BuildRulesService {
  static getHolidayIn(input: HolidayInputModel): All[] {
    return [
      {
        fact: 'date_in',
        operator: 'dateIsGreaterThan',
        value: input.fromDate
      },
      {
        fact: 'date_in',
        operator: 'dateIsLessThan',
        value: input.toDate
      }
    ]
  }

  static getDaily(): All[] {
    return [
      {
        fact: 'days',
        operator: 'greaterThanInclusive',
        value: 1
      }
    ]
  }

  public static getHolidayOut(input: HolidayInputModel): All[] {
    return [
      {
        fact: 'date_out',
        operator: 'dateIsGreaterThan',
        value: input.fromDate
      },
      {
        fact: 'date_out',
        operator: 'dateIsLessThan',
        value: input.toDate
      }
    ]
  }

  public static beginChargingWhen(whenIsAHalf: number): All[] {
    return [
      {
        fact: 'minute',
        operator: 'greaterThanInclusive',
        value: whenIsAHalf,
      }
    ]
  }

  public static getBlock(input: BlockInputModel, isHour: number): All[] {
    if (isHour == 0) {
      return [
        {
          fact: 'hour',
          operator: 'greaterThanInclusive',
          value: input.hourLowerLimit
        },
        {
          fact: 'hour',
          operator: 'lessThanInclusive',
          value: input.hourUpperLimit
        },
        {
          fact: 'minute',
          operator: 'greaterThanInclusive',
          value: input.minuteLowerLimit
        },
        {
          fact: 'minute',
          operator: 'lessThanInclusive',
          value: input.minuteUpperLimit
        }
      ]
    } else {
      return [
        {
          fact: 'hour',
          operator: 'greaterThanInclusive',
          value: input.hourLowerLimit
        },
        {
          fact: 'hour',
          operator: 'lessThanInclusive',
          value: input.hourUpperLimit
        },
      ]
    }

  }

  public static getRanksOut(input: RankInputModel): All[] {
    return [
      {
        fact: 'date_out_object',
        path: '$.hour',
        operator: 'greaterThanInclusive',
        value: input.fromTime.hours
      },
      {
        fact: 'date_out_object',
        path: '$.hour',
        operator: 'lessThanInclusive',
        value: input.toTime.hours
      },
      {
        fact: 'date_out_object',
        path: '$.minute',
        operator: 'greaterThanInclusive',
        value: input.fromTime.minutes
      },
      {
        fact: 'date_out_object',
        path: '$.minute',
        operator: 'lessThanInclusive',
        value: input.toTime.minutes
      }
    ]
  }

  public static getRanksOrScheduleIn(input: RankInputModel, isHour: number = 0): All[] {
    if (isHour == 0) {
      return [
        {
          fact: 'date_in_object',
          path: 'hour',
          operator: 'greaterThanInclusive',
          value: input.fromTime.hours
        },
        {
          fact: 'date_in_object',
          path: 'hour',
          operator: 'lessThanInclusive',
          value: input.toTime.hours
        },
        {
          fact: 'date_in_object',
          path: 'minute',
          operator: 'greaterThanInclusive',
          value: input.fromTime.minutes
        },
        {
          fact: 'date_in_object',
          path: 'minute',
          operator: 'lessThanInclusive',
          value: input.toTime.minutes
        }
      ]
    } else {
      return [
        {
          fact: 'date_in_object',
          path: 'hour',
          operator: 'greaterThanInclusive',
          value: input.fromTime.hours
        },
        {
          fact: 'date_in_object',
          path: 'hour',
          operator: 'lessThanInclusive',
          value: input.toTime.hours
        }
      ]
    }

  }

  public static getRanksOrScheduleOut(input: RankInputModel, isHour: number = 0): All[] {
    if (isHour == 0) {
      return [
        {
          fact: 'date_out_object',
          path: 'hour',
          operator: 'greaterThanInclusive',
          value: input.fromTime.hours
        },
        {
          fact: 'date_out_object',
          path: 'hour',
          operator: 'lessThanInclusive',
          value: input.toTime.hours
        },
        {
          fact: 'date_out_object',
          path: 'minute',
          operator: 'greaterThanInclusive',
          value: input.fromTime.minutes
        },
        {
          fact: 'date_out_object',
          path: 'minute',
          operator: 'lessThanInclusive',
          value: input.toTime.minutes
        }
      ]
    } else {
      return [
        {
          fact: 'date_out_object',
          path: 'hour',
          operator: 'greaterThanInclusive',
          value: input.fromTime.hours
        },
        {
          fact: 'date_out_object',
          path: 'hour',
          operator: 'lessThanInclusive',
          value: input.toTime.hours
        }
      ]
    }
  }

  public static getDaysIn(days: number[]): All[] {
    return [
      {
        fact: 'date_in',
        operator: 'dayIn',
        value: days
      }
    ]
  }

  public static getDailyEvent(costPerDay: DailyInputModel): IEvent {
    return {
      type: 'Tarifa por dia,',
      params: [
        {
          type: 'Dia',
          params: {
            value: costPerDay.costPerDay,
            path: 'days'
          }
        }
      ]
    }
  }

  public static getDaysOut(days: number[]): All[] {
    return [
      {
        fact: 'date_out',
        operator: 'dayIn',
        value: days
      }
    ]
  }

  public static getGlobalSchedule(input: RankInputModel): All[] {
    return [
      {
        fact: 'date_in_object',
        path: 'hour',
        operator: 'greaterThanInclusive',
        value: input.fromTime.hours
      },
      {
        fact: 'date_in_object',
        path: 'hour',
        operator: 'lessThanInclusive',
        value: input.toTime.hours
      },
      {
        fact: 'date_in_object',
        path: 'minute',
        operator: 'greaterThanInclusive',
        value: input.fromTime.minutes
      },
      {
        fact: 'date_in_object',
        path: 'minute',
        operator: 'lessThanInclusive',
        value: input.toTime.minutes
      }
    ]
  }

  public static getHourOrHalfEvent(input: HourHalfInputModel, isHour: number = 0): IEvent {
    if (isHour == 0) {
      return {
        type: 'Tarifa por fracción',
        params: [
          {
            type: 'Fracción',
            params: {
              value: input.costAHalf,
              path: 1,
              limit: input.subtractMinutes
            }
          }
        ]
      }
    } else {
      return {
        type: 'Tarifa por hora,',
        params: [
          {
            type: 'Hora',
            params: {
              value: input.costHour,
              path: 'hour',
              limit: input.subtract,
            }
          }
        ]
      }
    }
  }

  public static getFixedPriceEvent(input: FixedCostInputModel): IEvent {
    return {
      type: 'costo fijo',
      params: [
        {
          type: 'costo fijo',
          params: {
            value: input.fixedCost,
            path: 1,
            limit: input.subtract
          }
        }
      ]
    }
  }
}

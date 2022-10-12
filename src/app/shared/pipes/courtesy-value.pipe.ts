import {Pipe, PipeTransform} from '@angular/core'
import {CurrencyPipe} from '@angular/common'

@Pipe({
  name: 'courtesyValue'
})
export class CourtesyValuePipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {
  }

  transform(value: string | number, type: string | number): unknown {
    if (type == 1) {
      return `${value}%`
    } else if (type == 4) {
      return `${value} horas`
    } else {
      return this.currencyPipe.transform(value, 'GTQ', 'Q')
    }
  }
}

import {Pipe, PipeTransform} from '@angular/core'
import {TimeData} from '../../features/parking/models/CreateParking.model'

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(value: TimeData): unknown {
    return `${value.hour}:${value.minute}`
  }
}

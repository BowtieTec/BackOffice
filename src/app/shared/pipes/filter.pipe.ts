import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    const resultUsers = []
    for (const user of value) {
      if (user.name.toLowerCase().indexOf(arg) > -1) {
        resultUsers.push(user)
      }
    }
    return resultUsers
  }
}

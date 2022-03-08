import { Injectable } from '@angular/core'
import { RankInputModel } from '../model/RankTariff.model'
import { RuleModelSaved } from '../model/Tariff.model'

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {
  validateRankAgainstTheOthers(
    rankValues: RankInputModel,
    tariffs: Array<RuleModelSaved>
  ) {
    tariffs.forEach((tariff) => {
      console.log('Primer forEach')
      tariff.rules?.forEach((tariff) => {
        console.log('Segundo forEach')
        if (!tariff.conditions?.all) {
          console.log('No hay datos en tariff ', tariff.conditions?.all)
          throw new Error('Fallo en la validación de horarios.')
        }
        console.log(
          tariff.conditions.all[0]?.value,
          tariff.conditions.all[1]?.value,
          tariff.conditions.all[2]?.value,
          tariff.conditions.all[3]?.value,
          rankValues.fromTime?.hours,
          rankValues.fromTime?.minutes
        )
        if (
          tariff.conditions.all[0]?.value &&
          tariff.conditions.all[1]?.value &&
          tariff.conditions.all[2]?.value &&
          tariff.conditions.all[3]?.value &&
          rankValues.fromTime?.hours &&
          rankValues.fromTime?.minutes
        ) {
          console.log('Entrando al if de undefined')
          if (
            rankValues.fromTime.hours >= tariff.conditions.all[0].value &&
            rankValues.fromTime.hours <= tariff.conditions.all[1].value &&
            rankValues.fromTime.minutes >= tariff.conditions.all[2].value &&
            rankValues.fromTime.minutes <= tariff.conditions.all[3].value
          ) {
            console.log('Entrando primer if')
            throw new Error(
              'Este horario se traslapa con otros ya guardados. Por favor verifique los datos.'
            )
          }
          if (
            rankValues.toTime.hours >= tariff.conditions.all[0].value &&
            rankValues.toTime.hours <= tariff.conditions.all[1].value &&
            rankValues.toTime.minutes >= tariff.conditions.all[2].value &&
            rankValues.toTime.minutes <= tariff.conditions.all[3].value
          ) {
            console.log('Entrando segundo if')
            throw new Error(
              'Este horario se traslapa con otros ya guardados. Por favor verifique los datos.'
            )
          }
        }
      })
    })
  }
}

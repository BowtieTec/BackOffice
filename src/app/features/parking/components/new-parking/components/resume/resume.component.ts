import {Component, EventEmitter, Output} from '@angular/core'
import {ParkingService} from '../../../../services/parking.service'
import {CountriesModel} from '../../../../models/Countries.model'
import {MessageService} from '../../../../../../shared/services/message.service'
import {Day} from '../../../../models/SettingsOption.model'
import {AccessModel} from '../../../../models/CreateParking.model'

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent {
  @Output() changeStep = new EventEmitter<number>()
  countries: CountriesModel[] = new Array<CountriesModel>()

  constructor(
    private parkingService: ParkingService,
    private message: MessageService
  ) {
    this.getInitialData()
  }

  get stepOne() {
    return this.parkingService.parkingStepOne
  }

  get stepTwo() {
    return this.parkingService.parkingStepTwo
  }

  // }
  get stepFour() {
    return this.parkingService.parkingStepFour
  }

  get stepFive() {
    return this.parkingService.parkingStepFive
  }

  getInitialData() {
    return this.parkingService
      .getCountries()
      .toPromise()
      .then((data) => {
        this.countries = data.data
      })
  }

  getCountryById(id: number) {
    return this.parkingService.getCountryById(id)
  }

  getPayMethodById(id: number) {
    return this.parkingService.getPayMethodById(id)
  }

  getCurrencyById(id: number) {
    return this.parkingService.getCurrencyById(id)
  }

  getDayById(id: number): Day {
    return this.parkingService.getDayById(id)
  }

  getTypeAntennaById(id: number): AccessModel {
    return this.parkingService.getTypeAntennaById(id)
  }

  emmitStep(number: number) {
    this.changeStep.emit(number)
  }
}

import {Component} from '@angular/core'
import {FormBuilder, FormGroup} from '@angular/forms'
import {MessageService} from '../../../../shared/services/message.service'
import {ParkingService} from '../../services/parking.service'
import {SettingsOptionsModel} from '../../models/SettingsOption.model'

@Component({
  selector: 'app-new-parking',
  templateUrl: './new-parking.component.html',
  styleUrls: ['./new-parking.component.css']
})
export class NewParkingComponent {
  newParkingForm!: FormGroup
  totalSteps = 7
  step = 1

  settingsOptions!: SettingsOptionsModel

  constructor(
    private formBuilder: FormBuilder,
    private message: MessageService,
    private parkingService: ParkingService
  ) {
    this.newParkingForm = this.createForm()
    this.getInitialData()
  }

  get parkingId() {
    return this.parkingService.parkingStepOne.parkingId
  }

  get stepTwoForm() {
    return this.newParkingForm.get('stepTwo') as FormGroup
  }

  get stepFourForm() {
    return this.newParkingForm.get('stepFour') as FormGroup
  }

  get stepFiveForm() {
    return this.newParkingForm.get('stepFive') as FormGroup
  }

  changeStep(number: number) {
    this.step = this.step + number
  }

  saveParking() {
    this.message.showLoading()
    this.parkingService.clearObjects()
    this.message.OkTimeOut('Parqueo guardado')
  }

  private getInitialData() {
    this.message.showLoading()
    this.parkingService
      .getSettingsOptions()
      .subscribe((result: SettingsOptionsModel) => {
        this.parkingService.settingsOptions = result
        this.settingsOptions = this.parkingService.settingsOptions
        this.message.hideLoading()
      })
  }

  private createForm() {
    return this.formBuilder.group({})
  }
}

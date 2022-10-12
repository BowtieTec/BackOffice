import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms'
import {MessageService} from '../../../shared/services/message.service'
import {ParkingService} from '../../parking/services/parking.service'
import {UtilitiesService} from '../../../shared/services/utilities.service'
import {CreateParkingStepTwoModel} from '../../parking/models/CreateParking.model'
import {AuthService} from '../../../shared/services/auth.service'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  stepTwoForm: UntypedFormGroup = this.createForm()
  schedules: Array<any> = []
  @Input() parkingId!: string
  @Input() isCreatingParking = false
  @Output() changeStep = new EventEmitter<number>()

  constructor(
    private message: MessageService,
    private parkingService: ParkingService,
    private formBuilder: UntypedFormBuilder,
    private utilitiesService: UtilitiesService,
    private authService: AuthService
  ) {}

  get ParkingIdSelected() {
    return this.stepTwoForm.get('parkingId')?.value
      ? this.stepTwoForm.get('parkingId')?.value
      : this.parkingId
  }

  get isSudo() {
    return this.authService.isSudo
  }

  async emmitStep(number: number) {
    this.message.showLoading()
    if (number == 1) {
      await this.saveSchedules()
      this.changeStep.emit(number)
    } else {
      this.message.hideLoading()
      this.changeStep.emit(number)
    }
  }

  async saveSchedules() {
    if (this.stepTwoForm.valid) {
      this.parkingService.parkingStepTwo = this.getStepTwo()
      this.parkingService.parkingStepTwo.parkingId = this.parkingId
      await this.parkingService.setStepTwo().subscribe((data) => {
        if (data.success) {
          this.message.OkTimeOut('Guardado')
        } else {
          this.utilitiesService.markAsTouched(this.stepTwoForm)
          this.message.error('', data.message)
        }
      })
    } else {
      this.message.errorTimeOut(
        '',
        'Datos faltantes o incorrectos. Validar que los datos sean correctos.'
      )
      this.utilitiesService.markAsTouched(this.stepTwoForm)
    }
  }

  getParkingInf(parkingId: string) {
    this.message.showLoading()
    this.parkingId = this.ParkingIdSelected
    this.parkingService.getParkingInfo(parkingId).subscribe((x) => {
      this.schedules = x.schedules
      this.setSchedules(x.schedules)
      this.message.hideLoading()
    })
  }

  ngOnInit(): void {
    if (!this.isCreatingParking) {
      this.authService.user$.subscribe(({ parkingId }) => {
        this.parkingId = parkingId
        this.stepTwoForm.get('parkingId')?.setValue(parkingId)
        this.getParkingInf(parkingId)
      })
    }
  }

  private getStepTwo(): CreateParkingStepTwoModel {
    try {
      return {
        parkingId: this.stepTwoForm.controls['parkingId'].value,
        schedules: [
          {
            isOpen: this.stepTwoForm.controls['isOpen0'].value,
            day: 1,
            openning_time: {
              hour: this.stepTwoForm.controls['openning_time0'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['openning_time0'].value.split(':')[1],
              second: '00'
            },
            closing_time: {
              hour: this.stepTwoForm.controls['closing_time0'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['closing_time0'].value.split(':')[1],
              second: '00'
            }
          },
          {
            isOpen: this.stepTwoForm.controls['isOpen1'].value,
            day: 2,
            openning_time: {
              hour: this.stepTwoForm.controls['openning_time1'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['openning_time1'].value.split(':')[1],
              second: '00'
            },
            closing_time: {
              hour: this.stepTwoForm.controls['closing_time1'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['closing_time1'].value.split(':')[1],
              second: '00'
            }
          },
          {
            isOpen: this.stepTwoForm.controls['isOpen2'].value,
            day: 3,
            openning_time: {
              hour: this.stepTwoForm.controls['openning_time2'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['openning_time2'].value.split(':')[1],
              second: '00'
            },
            closing_time: {
              hour: this.stepTwoForm.controls['closing_time2'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['closing_time2'].value.split(':')[1],
              second: '00'
            }
          },
          {
            isOpen: this.stepTwoForm.controls['isOpen3'].value,
            day: 4,
            openning_time: {
              hour: this.stepTwoForm.controls['openning_time3'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['openning_time3'].value.split(':')[1],
              second: '00'
            },
            closing_time: {
              hour: this.stepTwoForm.controls['closing_time3'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['closing_time3'].value.split(':')[1],
              second: '00'
            }
          },
          {
            isOpen: this.stepTwoForm.controls['isOpen4'].value,
            day: 5,
            openning_time: {
              hour: this.stepTwoForm.controls['openning_time4'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['openning_time4'].value.split(':')[1],
              second: '00'
            },
            closing_time: {
              hour: this.stepTwoForm.controls['closing_time4'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['closing_time4'].value.split(':')[1],
              second: '00'
            }
          },
          {
            isOpen: this.stepTwoForm.controls['isOpen5'].value,
            day: 6,
            openning_time: {
              hour: this.stepTwoForm.controls['openning_time5'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['openning_time5'].value.split(':')[1],
              second: '00'
            },
            closing_time: {
              hour: this.stepTwoForm.controls['closing_time5'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['closing_time5'].value.split(':')[1],
              second: '00'
            }
          },
          {
            isOpen: this.stepTwoForm.controls['isOpen6'].value,
            day: 0,
            openning_time: {
              hour: this.stepTwoForm.controls['openning_time6'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['openning_time6'].value.split(':')[1],
              second: '00'
            },
            closing_time: {
              hour: this.stepTwoForm.controls['closing_time6'].value.split(
                ':'
              )[0],
              minute:
                this.stepTwoForm.controls['closing_time6'].value.split(':')[1],
              second: '00'
            }
          }
        ]
      }
    } catch (e) {
      throw e
    }
  }

  private createForm() {
    return this.formBuilder.group({
      parkingId: [this.parkingId],
      //Monday
      isOpen0: [{ value: true, disabled: true }],
      openning_time0: ['06:00:00'],
      closing_time0: ['00:00:00'],
      //Tuesday
      isOpen1: [{ value: true, disabled: true }],
      openning_time1: ['06:00:00'],
      closing_time1: ['00:00:00'],
      //Wednesday
      isOpen2: [{ value: true, disabled: true }],
      openning_time2: ['06:00:00'],
      closing_time2: ['00:00:00'],
      //Thursday
      isOpen3: [{ value: true, disabled: true }],
      openning_time3: ['06:00:00'],
      closing_time3: ['00:00:00'],
      //Friday
      isOpen4: [{ value: true, disabled: true }],
      openning_time4: ['06:00:00'],
      closing_time4: ['00:00:00'],
      //Saturday
      isOpen5: [{ value: true, disabled: true }],
      openning_time5: ['06:00:00'],
      closing_time5: ['00:00:00'],
      //Sunday
      isOpen6: [{ value: true, disabled: true }],
      openning_time6: ['06:00:00'],
      closing_time6: ['00:00:00']
    })
  }

  private setSchedules(schedules: any) {
    if (!schedules) {
      this.message.error('No se encontraron horarios para este parqueo')
      return
    }
    this.stepTwoForm.get('parkingId')?.setValue(this.parkingId)
    //Monday
    this.stepTwoForm
      .get('openning_time0')
      ?.setValue(
        `${schedules[0].openning_time.hour}:${schedules[0].openning_time.minute}:00`
      )
    this.stepTwoForm
      .get('closing_time0')
      ?.setValue(
        `${schedules[0].closing_time.hour}:${schedules[0].closing_time.minute}:00`
      )
    //Tuesday
    this.stepTwoForm
      .get('openning_time1')
      ?.setValue(
        `${schedules[1].openning_time.hour}:${schedules[1].openning_time.minute}:00`
      )
    this.stepTwoForm
      .get('closing_time1')
      ?.setValue(
        `${schedules[1].closing_time.hour}:${schedules[1].closing_time.minute}:00`
      )
    //Wednesday
    this.stepTwoForm
      .get('openning_time2')
      ?.setValue(
        `${schedules[2].openning_time.hour}:${schedules[2].openning_time.minute}:00`
      )
    this.stepTwoForm
      .get('closing_time2')
      ?.setValue(
        `${schedules[2].closing_time.hour}:${schedules[2].closing_time.minute}:00`
      )
    //Thursday
    this.stepTwoForm
      .get('openning_time3')
      ?.setValue(
        `${schedules[3].openning_time.hour}:${schedules[3].openning_time.minute}:00`
      )
    this.stepTwoForm
      .get('closing_time3')
      ?.setValue(
        `${schedules[3].closing_time.hour}:${schedules[3].closing_time.minute}:00`
      )
    //Friday
    this.stepTwoForm
      .get('openning_time4')
      ?.setValue(
        `${schedules[4].openning_time.hour}:${schedules[4].openning_time.minute}:00`
      )
    this.stepTwoForm
      .get('closing_time4')
      ?.setValue(
        `${schedules[4].closing_time.hour}:${schedules[4].closing_time.minute}:00`
      )
    //Saturday
    this.stepTwoForm
      .get('openning_time5')
      ?.setValue(
        `${schedules[5].openning_time.hour}:${schedules[5].openning_time.minute}:00`
      )
    this.stepTwoForm
      .get('closing_time5')
      ?.setValue(
        `${schedules[5].closing_time.hour}:${schedules[5].closing_time.minute}:00`
      )
    //Sunday
    this.stepTwoForm
      .get('openning_time6')
      ?.setValue(
        `${schedules[6].openning_time.hour}:${schedules[6].openning_time.minute}:00`
      )
    this.stepTwoForm
      .get('closing_time6')
      ?.setValue(
        `${schedules[6].closing_time.hour}:${schedules[6].closing_time.minute}:00`
      )
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {MessageService} from '../../../../../../shared/services/message.service'
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {CountriesModel} from '../../../../models/Countries.model'
import {ParkingService} from '../../../../services/parking.service'
import {ResponseModel} from '../../../../../../shared/model/Request.model'
import {CreateParkingStepOneModel} from '../../../../models/CreateParking.model'
import {UtilitiesService} from '../../../../../../shared/services/utilities.service'

@Component({
  selector: 'app-general-data',
  templateUrl: './general-data.component.html',
  styleUrls: ['./general-data.component.css']
})
export class GeneralDataComponent implements OnInit {
  stepOneForm: UntypedFormGroup = this.createForm()
  @Output() changeStep = new EventEmitter<number>()
  @Input() isPublic = false
  coords = {
    lat: this.parkingService.parkingStepOne.coordinates.latitude,
    lng: this.parkingService.parkingStepOne.coordinates.longitude
  }
  coordsMark = {
    lat: this.parkingService.parkingStepOne.coordinates.latitude,
    lng: this.parkingService.parkingStepOne.coordinates.longitude
  }
  countries: CountriesModel[] = []

  constructor(
    private message: MessageService,
    private parkingService: ParkingService,
    private formBuilder: UntypedFormBuilder,
    private utilitiesService: UtilitiesService
  ) {
  }

  get ParkingId() {
    return this.parkingService.parkingStepOne.parkingId
  }

  ngOnInit(): void {
    this.message.showLoading()
    this.getPosition()
      .then((r) => {
        if (this.coords.lng == 0 && this.coords.lat == 0) {
          this.coords = {...r}
        }
      })
      .catch(() => {
        this.message.error(
          '',
          'Se necesita poder acceder a la ubicación para mostrar el mapa y seleccionar la ubicación del parqueo.'
        )
      })
      .then(() => {
        return this.parkingService
          .getCountries()
          .toPromise()
          .then((data: ResponseModel) => (this.countries = data.data))
      })
      .then((data) => {
        this.message.hideLoading()
      })
  }

  addMapMark(event: google.maps.MapMouseEvent) {
    this.coordsMark = {lat: event?.latLng?.lat() || 0, lng: event?.latLng?.lng() || 0}
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({
            lng: resp.coords.longitude,
            lat: resp.coords.latitude
          })
        },
        (err) => reject(err)
      )
    })
  }

  emmitStep(number: number) {
    this.message.showLoading()
    if (number == 1 && this.parkingService.parkingStepOne.parkingId == '') {
      if (this.stepOneForm.valid) {
        this.parkingService.parkingStepOne = this.getStepOne()
        this.parkingService.setStepOne().subscribe((data) => {
          if (data.success) {
            this.changeStep.emit(number)
            this.message.OkTimeOut('Parqueo Guardado')
            this.parkingService.parkingStepOne.parkingId = data.data.id
            this.utilitiesService.disableForm(this.stepOneForm)
          } else {
            this.utilitiesService.markAsTouched(this.stepOneForm)
            this.message.error('', data.message)
          }
        })
      } else {
        this.message.errorTimeOut(
          '',
          'Datos faltantes o incorrectos. Validar que los datos sean correctos.'
        )
        this.utilitiesService.markAsTouched(this.stepOneForm)
      }
    } else {
      this.message.hideLoading()
      this.changeStep.emit(number)
    }
  }

  createForm() {
    return this.formBuilder.group({
      name: [this.parkingService.parkingStepOne.name, [Validators.required]],
      address: [
        this.parkingService.parkingStepOne.address,
        [Validators.required]
      ],
      parking_spaces: [
        this.parkingService.parkingStepOne.parking_spaces == 0
          ? ''
          : this.parkingService.parkingStepOne.parking_spaces,
        [Validators.required, Validators.min(0)]
      ],
      special_parking_spaces: [
        this.parkingService.parkingStepOne.special_parking_spaces == 0
          ? ''
          : this.parkingService.parkingStepOne.special_parking_spaces,
        [Validators.required, Validators.min(0)]
      ],
      minutes_to_exit: [
        this.parkingService.parkingStepOne.minutes_to_exit == 0
          ? ''
          : this.parkingService.parkingStepOne.special_parking_spaces,
        [Validators.required, Validators.min(0)]
      ],
      rules: [this.parkingService.parkingStepOne.rules, Validators.required],
      is_show_map: [this.parkingService.parkingStepOne.is_show_map],
      is_TAS: [this.parkingService.parkingStepOne.is_show_map],
      country: [
        this.parkingService.parkingStepOne.country
          ? null
          : this.parkingService.parkingStepOne.country,
        [Validators.required, Validators.min(1)]
      ]
    })
  }

  private getStepOne(): CreateParkingStepOneModel {
    return {
      parkingId: this.parkingService.parkingStepOne.parkingId,
      address: this.stepOneForm.controls['address'].value,
      coordinates: {
        latitude: this.coordsMark.lat,
        longitude: this.coordsMark.lng
      },
      country: this.stepOneForm.controls['country'].value,
      is_show_map: this.stepOneForm.controls['is_show_map'].value,
      minutes_to_exit: this.stepOneForm.controls['minutes_to_exit'].value,
      name: this.stepOneForm.controls['name'].value,
      parking_spaces: this.stepOneForm.controls['parking_spaces'].value,
      rules: this.stepOneForm.controls['rules'].value,
      special_parking_spaces:
      this.stepOneForm.controls['special_parking_spaces'].value,
      public: this.isPublic,
      is_draft: this.isPublic,
      is_TAS: this.stepOneForm.controls['is_TAS'].value,
    }
  }
}

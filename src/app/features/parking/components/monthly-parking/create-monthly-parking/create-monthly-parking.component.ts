import {Component, OnInit} from '@angular/core'
import {FormGroup, UntypedFormBuilder, Validators} from '@angular/forms'
import {MessageService} from '../../../../../shared/services/message.service'
import {ParkingService} from '../../../services/parking.service'
import {UtilitiesService} from '../../../../../shared/services/utilities.service'
import {AuthService} from '../../../../../shared/services/auth.service'
import {PermissionsService} from '../../../../../shared/services/permissions.service'
import {
  CreateProfilesModel,
  GetStationModel,
  MonthlyUserModel,
  ProfilesModel,
  SubscriptionModel
} from '../../../models/MontlyParking.model'
import {environment} from '../../../../../../environments/environment'
import {ResponseModel} from '../../../../../shared/model/Request.model'
import {ParkingModel} from '../../../models/Parking.model'

@Component({
  selector: 'app-create-monthly-parking',
  templateUrl: './create-monthly-parking.component.html',
  styleUrls: ['./create-monthly-parking.component.css']
})
export class CreateMonthlyParkingComponent implements OnInit {
  monthlyForm: FormGroup = this.createForm()
  currentDate: Date = new Date()
  userSelected: MonthlyUserModel = new MonthlyUserModel()
  userSearched: Array<MonthlyUserModel> = []
  profiles: ProfilesModel[] = []
  subscriptions: SubscriptionModel[] = []
  allParking: ParkingModel[] = Array<ParkingModel>()
  stationsByParking: GetStationModel[] = []
  nameProfile = ''
  loadingUser = false
  parkingId: string = ''
  searched: boolean = false
  //Permissions
  createMonthlyParking = environment.createMonthlyParking
  deleteMonthlyParking = environment.deleteMonthlyParking
  cancelMonthlyParking = environment.cancelMonthlyParking
  createAccessProfileMonthlyParking =
    environment.createAccessProfileMonthlyParking
  private actions: string[] = this.permissionService.actionsOfPermissions

  constructor(
    private formBuilder: UntypedFormBuilder,
    private message: MessageService,
    private parkingService: ParkingService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private permissionService: PermissionsService
  ) {
  }

  get nameTelephone() {
    if (!this.userSelected.name) {
      return ''
    }
    return `${this.completeNameSelected}, Teléfono: ${this.userSelected.phone_number} `
  }

  get completeNameSelected() {
    return `${this.userSelected.name} ${this.userSelected.last_name}`
  }

  get isSudo() {
    return this.authService.isSudo
  }

  get isUnlimitedForm() {
    return this.monthlyForm.controls['isUnlimited']
  }

  get isUnlimitedValue() {
    return this.monthlyForm.get('isUnlimited')?.value
  }

  getAntennasByParking() {
    return this.parkingService
      .getAntennas(this.authService.getParking().id)
      .subscribe((data) => {
        if (data.success) {
          this.stationsByParking = data.data.stations
          /*
          Para ver ejemplo de como se ver[ia con estaciones privadas,
          solo se debe comentar las siguientes dos lineas que pertenecen al filter:
          */
          this.stationsByParking = this.stationsByParking.filter(
            (x) => x.isPrivate
          )
        } else {
          this.message.error('', data.message)
        }
      })
  }

  searchUser() {
    this.loadingUser = true
    this.message.showLoading()
    this.parkingService
      .getUsersByTelephone(this.monthlyForm.controls['telephone'].value)
      .then((data) => {
        if (data.success) {
          this.userSearched = data.data.users
          this.searched = true
        }
      })
      .then(() => {
        this.message.hideLoading()
        this.loadingUser = false
      })
  }

  getInitialData() {
    return Promise.all([
      this.getProfiles(),
      this.getMonthlySubscription(),
      this.getAntennasByParking()
    ])
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId}) => {
      this.parkingId = parkingId
      this.monthlyForm.get('parkingId')?.setValue(parkingId)
      this.getInitialData().catch()
    })

    this.parkingService.parkingLot$.subscribe((parkingLot) => {
      this.allParking = parkingLot
    })

  }

  changeValueIsUnlimited() {
    const isUnlimited: boolean = this.isUnlimitedForm.value
    this.isUnlimitedForm.setValue(!isUnlimited)
  }

  controlInvalid(control: string): boolean {
    return this.utilitiesService.controlInvalid(this.monthlyForm, control)
  }

  getStationsToCreateProfile(): any {
    return this.stationsByParking.filter((x) => x.addStation)
  }

  createNewProfile() {
    if (this.nameProfile.length <= 0) {
      this.message.error('', 'No ha asignado un nombre el perfil de acceso')
      return
    }
    if (this.getStationsToCreateProfile().length <= 0) {
      this.message.error('', 'No ha elegido estaciones para el perfil')
      return
    }
    const newProfile: CreateProfilesModel = {
      parkingId: this.authService.getParking().id,
      name: this.nameProfile,
      stations: this.getStationsToCreateProfile()
    }
    this.parkingService.createAccessProfile(newProfile).then((data) => {
      this.resolveResponse(data)
    })
  }

  getFormValue() {
    const enables_days = this.getDays()
    if (enables_days.length <= 0) {
      this.message.error(
        '',
        'No ha seleccionado dias permitidos para entrar al parqueo mensual.'
      )
      return
    }
    let begin_date: Date = new Date(this.monthlyForm.controls['begin_date']?.value)
    let finish_date: Date = new Date(this.monthlyForm.controls['finish_date'].value)
    /*
    * This is because when we get the dates, takes this day minus one.
    * */
    begin_date.setDate(begin_date.getDate() + 1)
    finish_date.setDate(finish_date.getDate() + 1)
    return {
      userId: this.userSelected.id,
      parkingId: this.monthlyForm.getRawValue().parkingId,
      amount: this.monthlyForm.controls['amount'].value,
      enables_days,
      isUnlimited: this.isUnlimitedForm.value,
      begin_date,
      finish_date,
      profile_subscription:
      this.monthlyForm.getRawValue().profile_subscription
    }
  }

  cleanForm() {
    //this.monthlyForm.reset()
    this.userSelected = new MonthlyUserModel()
    this.userSearched = []
    this.isUnlimitedForm.setValue(true)
    this.monthlyForm.getRawValue().profile_subscription = ''
    this.monthlyForm.getRawValue().amount = ''
  }

  getProfiles() {
    const parkingId = this.authService.getParking().id
    return this.parkingService
      .getProfilesOfMonthlySubscription(parkingId)
      .then((data) => {
        if (data.success) {
          this.profiles = data.data.profiles
        } else {
          this.message.error(data.message)
        }
      })
  }

  resolveResponse(data: ResponseModel) {
    if (data.success) {
      this.getMonthlySubscription()
        .then(() => this.getProfiles())
        .then(() => this.message.Ok())
    } else {
      this.message.error('', data.message)
    }
  }

  getMonthlySubscription() {
    const parkingId = this.authService.getParking().id
    return this.parkingService
      .getMonthlySubscription(parkingId)
      .then((data) => {
        if (data.success) {
          this.subscriptions = data.data.subscriptions
        } else {
          this.message.error('', data.message)
        }
      })
  }

  createMonthly() {
    if (!this.monthlyForm.valid || !this.userSelected.id) {
      this.message.error(' Hacen falta datos o son inválidos.')
      return
    }
    if (new Date(this.monthlyForm.get('begin_date')?.value) > new Date(this.monthlyForm.get('finish_date')?.value)) {
      this.message.error('Las fechas no son validas. Valide que la segunda sea mayor que la primera.')
      return
    }

    this.message.showLoading()
    const newSubscription: any = this.getFormValue()
    if (!newSubscription) return
    if (this.monthlyForm.controls['profile_subscription'].value == '') {
      delete newSubscription.profile_subscription
    }
    this.parkingService
      .createMonthlySubscription(newSubscription)
      .then((data) => {
        if (!data.success) {
          this.message.error(data.message)
        }
        return this.getMonthlySubscription()
      })
      .then(() => {
        this.cleanForm()
        this.message.Ok('Guardado')

      })
      .catch()
  }

  createForm() {
    return this.formBuilder.group({
      parkingId: [this.parkingId, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      monday: [false],
      tuesday: [false],
      wednesday: [false],
      thursday: [false],
      friday: [false],
      saturday: [false],
      sunday: [false],
      telephone: ['', [Validators.maxLength(13)]],
      isUnlimited: [true],
      begin_date: [null],
      finish_date: [null],
      profile_subscription: ['']
    })
  }

  ifHaveAction(action: string) {
    return !!this.actions.find((x) => x == action)
  }

  userSelect(user: any) {
    this.userSelected = user
    this.message.OkTimeOut(user.name + ' ' + (user.last_name ? user.last_name : '') + ' Seleccionado')
  }

  private getDays() {
    return [
      {
        id: 0,
        name: 'Domingo',
        isEnable: this.monthlyForm.controls['sunday'].value
      },
      {
        id: 1,
        name: 'Lunes',
        isEnable: this.monthlyForm.controls['monday'].value
      },
      {
        id: 2,
        name: 'Martes',
        isEnable: this.monthlyForm.controls['tuesday'].value
      },
      {
        id: 3,
        name: 'Miércoles',
        isEnable: this.monthlyForm.controls['wednesday'].value
      },
      {
        id: 4,
        name: 'Jueves',
        isEnable: this.monthlyForm.controls['thursday'].value
      },
      {
        id: 5,
        name: 'Viernes',
        isEnable: this.monthlyForm.controls['friday'].value
      },
      {
        id: 6,
        name: 'Sábado',
        isEnable: this.monthlyForm.controls['saturday'].value
      }
    ].filter((day) => day.isEnable === true)
  }
}
